import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        // Verificar si el email ya existe
        const existingUser = await this.usersService.findByEmail(registerDto.user_mail);
        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(registerDto.user_password, 10);

        // Crear usuario
        const user = await this.usersService.create({
            ...registerDto,
            user_password: hashedPassword,
        });

        return {
            message: 'Usuario registrado exitosamente',
            user_id: user.user_id,
            user_mail: user.user_mail,
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.user_mail);

        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.user_password, user.user_password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload = { sub: user.user_id, email: user.user_mail };
        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
            user: {
                user_id: user.user_id,
                user_name: user.user_name,
                user_mail: user.user_mail,
            },
        };
    }
}
