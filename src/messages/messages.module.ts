import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { WebsocketExceptionsFilter } from '../common/filters/websocket-exceptions.filter';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]), 
    UserModule,
    AuthModule
  ],
  providers: [MessagesService, MessagesGateway, WebsocketExceptionsFilter],
})
export class MessagesModule {}