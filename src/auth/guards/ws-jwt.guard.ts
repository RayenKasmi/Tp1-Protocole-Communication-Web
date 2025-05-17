import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PayloadInterface } from '../strategies/jwt.strategy';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client = context.switchToWs().getClient<Socket>();
      const token = client.handshake.auth.token || 
                   client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        throw new WsException('No authentication token provided');
      }

      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      const payload = this.jwtService.verify(token, { secret: jwtSecret }) as PayloadInterface;
      
      if (!payload || !payload.username) {
        throw new WsException('Invalid token');
      }

      // Attach user data to client for use in handlers
      client.data.user = payload;
      
      return true;
    } catch (error) {
      throw new WsException('Unauthorized access');
    }
  }
}
