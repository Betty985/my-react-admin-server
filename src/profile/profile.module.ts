import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { FollowsEntity } from './entities/profile.entity';
import { UserModule } from 'src/user/user.module';
import { AuthMiddleware } from 'src/user/auth.middleware';

@Module({
  imports:[TypeOrmModule.forFeature([User,FollowsEntity]),UserModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({path:'profiles/:username/follow',method:RequestMethod.ALL})
  }
}
