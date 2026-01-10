import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
    ) {
        // Configuración de la estrategia JWT
        super({
            // jwtFromRequest: Cómo obtener el token (del header Authorization: Bearer <token>)
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // ignoreExpiration: false -> Rechaza tokens expirados automáticamente
            ignoreExpiration: false,
            // secretOrKey: Clave secreta para verificar la firma
            // Usamos un fallback 'secretKey' por seguridad de tipos, pero en producción DEBE venir de .env
            secretOrKey: configService.get('JWT_SECRET') || 'secretKey',
        });
    }

    // validate(): Se ejecuta después de que Passport verifica la firma del token.
    // El payload es el contenido decodificado del token.
    async validate(payload: any) {
        // payload.sub es el user_id (number) que pusimos en auth.service.ts
        // Verificamos que el usuario siga existiendo en la base de datos
        const user = await this.usersService.findOne(payload.sub);

        if (!user) {
            // Si el usuario fue borrado pero el token sigue válido, rechazamos el acceso
            throw new UnauthorizedException();
        }

        // Lo que retornamos aquí se inyecta en request.user
        return { userId: payload.sub, email: payload.email };
    }
}