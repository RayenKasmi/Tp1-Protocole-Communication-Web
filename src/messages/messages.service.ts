import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { GenericCrudService } from '../common/services/generic.crud.service';
import { UserService } from '../user/user.service';

@Injectable()
export class MessagesService extends GenericCrudService<Message> {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private readonly userService: UserService
  ) {
    super(messageRepository);
  }

  async sendMessage(senderUsername: string, dto: SendMessageDto): Promise<Message> {
    try {
      const sender = await this.userService.findOneBy({ username: senderUsername });
      const receiver = await this.userService.findOneBy({ username: dto.receiverUsername });

      return this.create({
        content: dto.content,
        sender,
        receiver
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Receiver not found');
      }
      throw error;
    }
  }
}