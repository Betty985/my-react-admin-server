import { Controller , Get} from '@nestjs/common';

@Controller('chatroom')
export class ChatroomController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
