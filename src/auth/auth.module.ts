import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import appConfig from '../config/app.config';
import AppConfig from '../config/app.config';
import { RolesGuard } from '../common/guards/roles.guard';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { WsJwtGuard } from './guards/ws-jwt.guard';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(appConfig)],
      inject: [AppConfig.KEY],
      useFactory: (config: ConfigType<typeof AppConfig>) => ({
        secret: config.authorization.jwt,
        signOptions: { expiresIn: `${config.authorization.expiration}m` },
      }),
    }),
  ],
  controllers: [AuthController],  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    WsJwtGuard,
  ],
  exports: [AuthService, JwtStrategy, JwtModule, WsJwtGuard],
})
export class AuthModule {}
