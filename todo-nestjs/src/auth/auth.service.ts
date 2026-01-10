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

    // Registro de nuevos usuarios
    async register(registerDto: RegisterDto) {
        // 1. Verificar si el email ya existe para evitar duplicados
        const existingUser = await this.usersService.findByEmail(registerDto.user_mail);
        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        // 2. Encriptar la contraseña (Hashing)
        // '10' es el salt rounds (costo de procesamiento)
        const hashedPassword = await bcrypt.hash(registerDto.user_password, 10);

        // 3. Crear el usuario en base de datos con la contraseña hasheada
        const user = await this.usersService.create({
            ...registerDto,
            user_password: hashedPassword,
        });

        // Retornar información básica (evitando devolver la password)
        return {
            message: 'Usuario registrado exitosamente',
            user_id: user.user_id,
            user_mail: user.user_mail,
        };
    }

    // Inicio de sesión
    async login(loginDto: LoginDto) {
        // 1. Buscar usuario por email
        const user = await this.usersService.findByEmail(loginDto.user_mail);

        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // 2. Comparar contraseña enviada con la hasheada en BD
        const isPasswordValid = await bcrypt.compare(loginDto.user_password, user.user_password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // 3. Generar JWT (JSON Web Token)
        // payload: datos que viajan en el token (NO poner info sensible como contraseñas)
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
