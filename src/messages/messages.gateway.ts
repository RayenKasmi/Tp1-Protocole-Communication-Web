import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';
import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { WsGetUser } from '../common/decorators/ws-get-user.decorator';
import { PayloadInterface } from '../auth/strategies/jwt.strategy';
import { WebsocketExceptionsFilter } from '../common/filters/websocket-exceptions.filter';
import { WsAuthHelper } from '../auth/helpers/ws-auth.helper';

@UseFilters(WebsocketExceptionsFilter)
@WebSocketGateway({ 
  cors: true,
  namespace: '/messages'
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private users = new Map<string, Socket>();
  private readonly logger = new Logger(MessagesGateway.name);  
  constructor(
    private messagesService: MessagesService,
    private wsJwtGuard: WsJwtGuard,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Use the WsJwtGuard to authenticate the connection
      const user = await WsAuthHelper.authenticateConnection(this.wsJwtGuard, client);
      
      if (!user || !user.username) {
        this.disconnect(client, 'Authentication failed');
        return;
      }

      this.logger.log(`Client connected: ${user.username}`);
      this.users.set(user.username, client);
    } catch (error) {
      this.disconnect(client, 'Authentication failed');
    }
  }

  private disconnect(client: Socket, message: string) {
    client.emit('error', new WsException(message));
    client.disconnect();
  }

  handleDisconnect(client: Socket) {
    for (const [username, sock] of this.users.entries()) {
      if (sock.id === client.id) {
        this.logger.log(`Client disconnected: ${username}`);
        this.users.delete(username);
      }
    }
  }  
  @UseFilters(WebsocketExceptionsFilter)
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('send_message')
  async onSendMessage(
    @MessageBody() dto: SendMessageDto,
    @ConnectedSocket() client: Socket,
    @WsGetUser() user: PayloadInterface
  ) {
    try {
        if (dto.receiverUsername === user.username) {
            throw new WsException('Cannot send message to yourself.');
        }

        const message = await this.messagesService.sendMessage(user.username, dto);

        if (!message) {
            throw new WsException('Failed to send message');
        }

        // Emit message to sender to confirm delivery
        client.emit('message_sent', { success: true, messageId: message.id });

        const receiverSocket = this.users.get(dto.receiverUsername);
        if (receiverSocket) {
            receiverSocket.emit('receive_message', message);
        }
        else{
            this.logger.warn(`Receiver ${dto.receiverUsername} is not connected`);
            client.emit('user_offline', { receiverUsername: dto.receiverUsername });
        }

        return { success: true };
    } catch (error) {
        this.logger.error(`Error sending message: ${error.message}`, error.stack);
        throw new WsException(error.message || 'Failed to send message');
    }
  }
}