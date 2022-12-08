import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User as UserEntity } from 'src/user/entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FollowsEntity } from './entities/profile.entity';
import { IProfile, ProfileData } from './profile.interface';
@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowsEntity)
    private readonly followsRepository: Repository<FollowsEntity>,
  ) {}
  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(options?:any): Promise<IProfile> {
    const user = await this.userRepository.findOne(options);
    if (user) {
      delete user.id;
      delete user.password;
    }
    return {
      profile: user,
    };
  }
  async findProfile(
    id: number,
    followingUsername: string,
  ): Promise<IProfile> | undefined {
    const _profile = await this.userRepository.findOneBy({
      username: followingUsername,
    });
    if (_profile) {
      let profile: ProfileData = {
        username: _profile.username,
        bio: _profile.bio,
        image: _profile.image,
      };
      const follows = await this.followsRepository.findOneBy({
        followerId: id,
        followingId: _profile.id,
      });
      if (id) {
        profile.following = Boolean(follows);
      }
      return { profile };
    }
  }
  async followManage(
    username: string,
    follow: boolean,
    followerId?: number,
    followerEmail?: string,
  ): Promise<IProfile> {
    if ((follow ? !followerEmail : !followerId) || !username) {
      throw new HttpException(
        'Follower email and username not provided.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const followingUser = await this.userRepository.findOneBy({ username });
    if (followerEmail === followingUser.email) {
      throw new HttpException(
        'FollowerEmail and FollowingId cannot be equal.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (followingUser.id === followerId) {
      throw new HttpException(
        'FollowerId and FollowingId cannot be equal.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (follow) {
      const followerUser = await this.userRepository.findOneBy({
        email: followerEmail,
      });
      const _follows = await this.followsRepository.findOneBy({
        followerId: followerUser.id,
        followingId: followingUser.id,
      });
      if (!_follows) {
        const follows = new FollowsEntity();
        follows.followerId = followerUser.id;
        follows.followingId = followingUser.id;
        await this.followsRepository.save(follows);
      }
    } else {
      const followingId = followingUser.id;
      await this.followsRepository.delete({ followerId, followingId });
    }

    const { bio, image } = followingUser;
    const profile: ProfileData = {
      bio,
      image,
      username: followingUser.username,
      following: follow,
    };
    return { profile };
  }
  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
