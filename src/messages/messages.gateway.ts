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
import { Injectable, Logger, UseFilters, UseGuards } from '@nestjs/common';
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
  private readonly logger = new Logger(MessagesGateway.name);  constructor(
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

      // Store user info for quick lookup
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
  }  @UseFilters(WebsocketExceptionsFilter)
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('send_message')
  async onSendMessage(
    @MessageBody() dto: SendMessageDto,
    @ConnectedSocket() client: Socket,
    @WsGetUser() user: PayloadInterface
  ) {
    try {
      // User is now available directly through the decorator
      const message = await this.messagesService.sendMessage(user.username, dto);

      // Emit message to sender to confirm delivery
      client.emit('message_sent', { success: true, messageId: message.id });

      // Emit message to receiver if they're online
      const receiverSocket = this.users.get(dto.receiverUsername);
      if (receiverSocket) {
        receiverSocket.emit('receive_message', message);
      }

      return { success: true };
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`, error.stack);
      throw new WsException(error.message || 'Failed to send message');
    }
  }
}