import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './user.model';
import { IRegister } from 'src/models/register.interface';
import { UtilsService } from 'src/utils/utils.service';
import { ILogin } from 'src/models/login.interface';
import { IPayload } from 'src/models/payload.models';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class UserService {
    constructor(@InjectModel('user') private userModel: Model<User>, private utilsSvc: UtilsService) { }

    async create(register: IRegister) {
        const { email, username } = register;
        const user = await this.userModel.findOne({ $or: [{ username }, { email }] });
        if (user) {
            throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
        }
        const createdUser = new this.userModel(register);
        await createdUser.save();
        return this.utilsSvc.sanitizeUser(createdUser);
    }

    async findByLogin(user: ILogin) {
        const { email, password } = user;
        const userInDB = await this.userModel.findOne({ email });
        if (!userInDB) {
            throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
        }
        if (await bcrypt.compare(password, userInDB.password)) {
            return this.utilsSvc.sanitizeUser(userInDB)
        } else {
            throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
        }
    }

    async findByPayload(payload: IPayload) {
        const { email } = payload;
        return await this.userModel.findOne({ email });
    }

    async findById(userId: string) {

    }
}
