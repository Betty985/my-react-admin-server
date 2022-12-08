import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserDecorator } from 'src/user/user.decorator';
import { IProfile } from './profile.interface';
@ApiBearerAuth()
@ApiTags('profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get(':username')
  async getProfile(
    @UserDecorator('id') userId: number,
    @Param('username') username: string,
  ): Promise<IProfile> {
    return await this.profileService.findProfile(userId, username);
  }
  @Post(':username/follow')
  async follow(
    @UserDecorator('email') email: string,
    @Param('username') username: string,
  ): Promise<IProfile> {
    return await this.profileService.followManage(
      username,
      true,
      undefined,
      email,
    );
  }
  @Delete(':username/follow')
  async unFollow(
    @UserDecorator('id') userId: number,
    @Param('username') username: string,
  ): Promise<IProfile> {
    return await this.profileService.followManage(username, false, userId);
  }
}
