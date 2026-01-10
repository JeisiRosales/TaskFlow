import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard global o por ruta para proteger endpoints.
 * Extiende AuthGuard('jwt') que usa la estrategia 'jwt' definida en JwtStrategy.
 * Si el token es inválido o no existe, retorna 401 Unauthorized automáticamente.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }