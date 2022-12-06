import {Entity,PrimaryColumn,Column,BeforeInsert,JoinTable,ManyToMany,OneToMany} from 'typeorm'
import {IsEmail} from 'class-validator'
import argon2 from 'argon2'
@Entity('user')
export class User {
  @PrimaryColumn()
  id:number
  @Column()
  username:string;
  @Column()
  @IsEmail()
  email:string;
  @Column({default:''})
  bio:string;
  @Column({default:''})
  image:string;
  @Column()
  password:string;
  @BeforeInsert()
 async hashPassword ()  {
    this.password=await argon2.hash(this.password)
 }
}
