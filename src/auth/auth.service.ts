import { Injectable } from '@nestjs/common';
import { JwtPayload, sign } from 'jsonwebtoken';
import { IPayload } from 'src/models/payload.models';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) { }

    async sign(payload: JwtPayload) {
        return sign(payload, process.env.SECRET_KEY, { expiresIn: '60s' });
    }

    async refreshToken(payload: JwtPayload) {
        return sign(payload, process.env.SECRET_KEY, { expiresIn: '7d' });
    }

    async validateUser(payload: IPayload) {
        return await this.userService.findByPayload(payload);
    }

    verifyToken() {

    }
}
