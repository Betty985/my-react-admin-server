import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { SECRET } from "src/config";
import { UserService } from "./user.service";
import jwt from 'jsonwebtoken'

@Injectable()
export class AuthMiddleware implements NestMiddleware{
    constructor(private readonly userService:UserService){}
    async use(req: any, res: any, next:NextFunction) {
        const authHeaders=req.headers.authorization??''
        const token=authHeaders.split(' ')[1]
        if(token){
        const decoded:any=jwt.verify(token,SECRET)
        const user=await this.userService.findById(decoded.id)
        if(!user){
            throw new HttpException('User not found',HttpStatus.UNAUTHORIZED)
        }
        req.user=user.user
        next()
        }else{
            throw new HttpException('Not authorized',HttpStatus.UNAUTHORIZED)
        }
    }
}