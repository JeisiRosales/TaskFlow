import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth') // Prefijo: /auth
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register') // POST /auth/register
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login') // POST /auth/login
    @HttpCode(HttpStatus.OK) // Cambiar status por defecto 201 a 200 OK
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
