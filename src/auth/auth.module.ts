import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule, // Importamos UsersModule para poder usar UsersService
    PassportModule, // Módulo base de Passport
    // JwtModule.registerAsync: Configuración asíncrona de JWT.
    // Usamos useFactory para leer variables de entorno como el secreto y la expiración.
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // Secreto para firmar los tokens (DEBE ser seguro y no estar en el código)
        secret: configService.get('JWT_SECRET'),
        // Opciones de firma, como tiempo de expiración (ej. '1h', '1d')
        signOptions: { expiresIn: configService.get('JWT_EXPIRATION') || '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // JwtStrategy debe ser un provider
})
export class AuthModule { }
