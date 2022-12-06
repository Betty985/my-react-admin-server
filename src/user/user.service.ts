import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User as UserEntity } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, UserLoginDto } from './dto';
import { getRepository, Repository, DeleteResult } from 'typeorm';
import argon2 from 'argon2';
import { IUser } from './user.interface';
import { validate } from 'class-validator';
import jwt from 'jsonwebtoken';
import { SECRET } from './config';
const VALIDATION_FAILED = 'Input data validation failed';
// 提供者的主要思想是它可以作为依赖注入；
// 这意味着对象之间可以创建各种关系，
// 并且“连接”对象实例的功能可以在很大程度上委托给 Nest 运行时系统。
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  private buildUser(user: UserEntity) {
    const userRO = Object.assign({}, user, { token: this.generateJWT(user) });
    return { user: userRO };
  }
  generateJWT(user: UserEntity) {
    const { id, username, email } = user;
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    return jwt.sign({ id, username, email, exp: exp.getTime() / 1000 }, SECRET);
  }
  async create(dto: CreateUserDto): Promise<IUser> {
    const { username, email, password } = dto;
    const qb = await getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.username=:username', { username })
      .orWhere('user.email=:email', { email });
    const user = await qb.getOne();
    if (user) {
      const errors = { username: 'Username and email must be unique' };
      throw new HttpException(
        { message: VALIDATION_FAILED, errors },
        HttpStatus.BAD_REQUEST,
      );
    }
    let newUser = new UserEntity();
    let tmp = { username, email, password, articles: [] };
    for (let key in tmp) {
      newUser[key] = tmp[key];
    }
    const errors = await validate(newUser);
    if (errors.length) {
      const _errors = { username: 'Userinput is not valid' };
      throw new HttpException(
        { message: VALIDATION_FAILED, _errors },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const savedUser = await this.userRepository.save(newUser);
      return this.buildUser(savedUser);
    }
  }
  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }
  async findOne({ email, password }: UserLoginDto): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ email });
    //  验证密码
    const verify = await argon2.verify(user.password, password);
    if (user && verify) {
      return user;
    }
    return null;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const toUpdate = await this.userRepository.findOneBy({ id });
    const updated = Object.assign(toUpdate, UpdateUserDto);
    return await this.userRepository.save(updated);
  }

  async delete(email: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ email });
  }
  async findById(id: number): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      const errors = { User: 'not found' };
      throw new HttpException({ errors }, HttpStatus.UNAUTHORIZED);
    }
    return this.buildUser(user);
  }
  async findByEmail(email: string): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ email });
    return this.buildUser(user);
  }
}
