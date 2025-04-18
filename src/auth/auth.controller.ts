import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ){}
    @Post('register')
    async register(
        @Body() registerDto: RegisterDto,
    )
    {
        return this.authService.register(registerDto);
    }
    
    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
    )
    {
        return this.authService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('test')
    async test(
        @GetUser() user: any,
    ) {
        return { 
            message: 'Test endpoint', 
            user: user 
          };
    }
}
