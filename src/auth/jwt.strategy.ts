import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';


import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private refreshToken: string;

    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRET_KEY,
        });
    }

    async validate(payload: any): Promise<any> {
        try {
            const user = await this.authService.validateUser(payload);
            if (!user) {
                throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
            }

            return user;
        } catch (error) {
            throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
        }
    }

    // Creamos un método para establecer el valor del refresh token en la estrategia
    setRefreshToken(refreshToken: string) {
        this.refreshToken = refreshToken;
    }

    // Creamos un método para obtener el valor del refresh token de la estrategia
    getRefreshToken(): string {
        return this.refreshToken;
    }
}