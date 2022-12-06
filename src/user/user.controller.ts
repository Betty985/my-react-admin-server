import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto,UpdateUserDto,UserLoginDto } from './dto';
import { ApiBearerAuth ,ApiTags} from '@nestjs/swagger';
@ApiBearerAuth()//基本身份验证
@ApiTags('user')//将控制器附加到特定标签
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
//   @Get('user')
//  async findMe() => {
  
//  }
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
