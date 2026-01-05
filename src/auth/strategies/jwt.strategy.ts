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
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            // Fix: Ensure secretOrKey is defined. 
            // safeSecret ensures we pass a string, avoiding the 'string | undefined' error.
            secretOrKey: configService.get('JWT_SECRET') || 'secretKey',
        });
    }

    async validate(payload: any) {
        // payload.sub is the user_id (number)
        const user = await this.usersService.findOne(payload.sub);

        if (!user) {
            throw new UnauthorizedException();
        }

        return { userId: payload.sub, email: payload.email };
    }
}