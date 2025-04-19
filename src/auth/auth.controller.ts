import { Body, Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
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

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('admin')
    @Get('admin')
    async admin( @Request() req: any) 
    {
        return { 
            message: 'Only admins can access this endpoint', 
            user: user 
          };
    }

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('admin', 'user')
    @Get('admin_user')
    async admin_user( @Request() req: any) 
    {
        return { 
            message: 'both admins and users can access this endpoint', 
            user: req.user 
          };
    }

}
