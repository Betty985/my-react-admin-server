import { createParamDecorator,ExecutionContext } from "@nestjs/common";
import { SECRET } from "./config";
import jwt from 'jsonwebtoken'
// TODO:
export const UserDecorator=createParamDecorator((data:string,ctx:ExecutionContext)=>{
    const req=ctx.switchToHttp().getRequest()
    if(Boolean(req.user)){
        return Boolean(data)?req.user[data]:req.user
    }
    const {authorization}=req.headers
    const token=authorization?(String(authorization)).split(' ')[1]:null
    if(token){
        // TODO:
        const decoded:any=jwt.verify(token,SECRET)
        return Boolean(data)?decoded[data]:decoded.user
    }
})