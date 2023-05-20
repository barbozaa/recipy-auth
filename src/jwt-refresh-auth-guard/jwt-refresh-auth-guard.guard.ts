import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { verify } from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtRefreshAuthGuardGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private authSvc: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
      const payload = verify(token, process.env.SECRET_KEY) as any;
      const user = await this.authSvc.validateUser(payload);
      if (!user) {
        throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
      }
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const refreshToken = request.headers['refresh_token'];
        try {
          const payload = verify(refreshToken, process.env.JWT_REFRESH_SECRET) as any;
          const user = await this.authSvc.validateUser(payload);
          if (!user) {
            throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
          }

          // Generar nuevos tokens de acceso y refresh token
          const accessToken = this.authSvc.sign(payload);
          const refresh_oken = this.authSvc.refreshToken(payload);

          // Agregar nuevos tokens a la respuesta
          request.res.set('Authorization', `Bearer ${accessToken}`);
          request.res.set('Refresh-Token', refresh_oken);

          return true;
        } catch (error) {
          if (error.name === 'JsonWebTokenError') {
            throw new UnauthorizedException('Invalid token');
          }
        }

        if (!refreshToken) {
          throw new UnauthorizedException('Token expired and refresh token not provided');
        }
      }
    }
    return super.canActivate(context) as boolean;
  }

  handleRequest(err: any, user: any): any {
    if (err || !user) {
      throw err || new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
