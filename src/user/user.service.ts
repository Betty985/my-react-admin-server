import { Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm'
import {User as UserEntity} from './entities/user.entity'
import { CreateUserDto,UpdateUserDto,UserLoginDto } from './dto';
import {Repository} from 'typeorm'
import argon2 from 'argon2'
// 提供者的主要思想是它可以作为依赖注入；
// 这意味着对象之间可以创建各种关系，
// 并且“连接”对象实例的功能可以在很大程度上委托给 Nest 运行时系统。
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository:Repository<UserEntity>
  ){}
  // TODO:
  async create(createUserDto: CreateUserDto):Promise<any> {
    return 'This action adds a new user';
  }
  async findAll():Promise<UserEntity[]>{
    return await this.userRepository.find()
  }
  async findOne({email,password}:UserLoginDto):Promise<UserEntity> {
   const user =await this.userRepository.findOneBy({email})
  //  验证密码
   const verify=await argon2.verify(user.password,password)
   if(user&&verify){
    return user
   }
   return null
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
