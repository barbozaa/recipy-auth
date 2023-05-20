import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.model';

@Injectable()
export class UtilsService {
    constructor() { }

    sanitizeUser(user: User) {
        const sanitized = user.toObject();
        delete sanitized['password'];
        return sanitized;
    }
}
