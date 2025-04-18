import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findOneBy({ username });
        if (user && (await user.validatePassword(password))) {
          const { password, ...result } = user;
          return result;
        }
        return null;
      }

    async register(registerDto: RegisterDto) {
        console.log('Registering user:', registerDto);
        const { username, password, email } = registerDto;

        // const existingUserByUsername = await this.userService.findOneBy({ username });
        // const existingUserByEmail = await this.userService.findOneBy({ email });

        // if (existingUserByUsername || existingUserByEmail) {
        //     throw new ConflictException('User already exists');
        // }

        const user = await this.userService.create(registerDto);
        return this.generateToken(user);
    }

    async login(loginDto: LoginDto) {
        const { username, password } = loginDto;
        const user = await this.userService.findOneBy({username});
        if (!user || !(await user.validatePassword(password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateToken(user);
    }

    generateToken(user: any) {
        const payload = { 
          username: user.username, 
          sub: user.id,
          email: user.email,
          role: user.role,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        };
    
        const secret = this.configService.get<string>('JWT_SECRET');
        const accessToken = this.jwtService.sign(payload, { secret });
    
        return {
          accessToken,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        };
      }

}
