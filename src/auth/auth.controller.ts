import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { IRegister } from 'src/models/register.interface';
import { ILogin } from 'src/models/login.interface';
import { JwtRefreshAuthGuardGuard } from 'src/jwt-refresh-auth-guard/jwt-refresh-auth-guard.guard';

@Controller('auth')
export class AuthController {
    constructor(private userSvc: UserService, private authSvc: AuthService) { }

    @Post('register')
    async register(@Body() register: IRegister) {
        const user = await this.userSvc.create(register);
        const payload = {
            email: user.email,
        };

        const token = await this.authSvc.sign(payload);
        const refreshToken = await this.authSvc.refreshToken(payload);
        return { user, token, refresh_token: refreshToken };
    }
    @Post('login')
    async login(@Body() userBody: ILogin) {
        const user = await this.userSvc.findByLogin(userBody);
        const payload = {
            email: user.email,
        };
        const token = await this.authSvc.sign(payload);
        const refreshToken = await this.authSvc.refreshToken(payload);
        return { user, token, refresh_token: refreshToken };
    }

    @Post('refresh-token')
    async refreshToken(@Body() refreshTokenDto: any) {
        return this.authSvc.refreshToken(refreshTokenDto.refreshToken);
    }

    @Get("/onlyauth")
    @UseGuards(JwtRefreshAuthGuardGuard)
    async hiddenInformation() {
        return "hidden information";
    }
}
