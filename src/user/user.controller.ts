import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto,UpdateUserDto,UserLoginDto } from './dto';
import { ApiBearerAuth ,ApiTags} from '@nestjs/swagger';
import { User as UserEntity } from './entities/user.entity';
import { UserDecorator } from './user.decorator';
import { IUser } from './user.interface';
@ApiBearerAuth()//基本身份验证
@ApiTags('user')//将控制器附加到特定标签
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('user')
 async findMe(@UserDecorator('email') email:string):Promise<IUser> {
    return await this.userService.findByEmail(email)
 }
//  TODO:pipe
  @Post('users')
  async create(@Body('user') createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Put('user')
  async update(@Param('id') userId: number, @Body('user') userData: UpdateUserDto) {
    return await this.userService.update(userId,userData);
  }
  @Delete('users/:slug')
  async delete(@Param() params) {
    return this.userService.delete(params.slug)
  }
  // TODO:pipe
  @Post('users/login')
  async login(@Body('user') UserLoginDto:UserLoginDto):Promise<IUser>{
    const user=await this.userService.findOne(UpdateUserDto)
const errors={User:'not found'}
if(!user){
  throw new HttpException({errors},HttpStatus.UNAUTHORIZED)

}
const token=await this.userService.generateJWT(user)
const {email,username,bio,image}= user
return {user:{email,username,bio,image,token}}
  }
}
