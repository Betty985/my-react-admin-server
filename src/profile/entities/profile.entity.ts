import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity('follows')
export class FollowsEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    followerId:number;
    @Column()
    followingId:number
}
export class Profile {}
