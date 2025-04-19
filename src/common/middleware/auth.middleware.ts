import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.headers['auth-user'] as string;

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Authentication token is missing' });
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');

      if (!secret) {
        return res
          .status(500)
          .json({ message: 'JWT secret is not configured' });
      }

      const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

      if (!decoded.userId) {
        return res
          .status(401)
          .json({ message: 'Invalid token: userId not found' });
      }

      req.userId = decoded.userId;

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
}
