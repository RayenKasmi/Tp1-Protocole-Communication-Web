import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface PayloadInterface {
  username: string;
  sub: number | string; //subject or user id
  email?: string;
  role?: string;
  iat?: number; // Issued at timestamp
  exp?: number; // Expiration timestamp
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: PayloadInterface) {
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
