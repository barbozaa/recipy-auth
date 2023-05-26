import { BadRequestException } from '@nestjs/common';

export class InvalidImageException extends BadRequestException {
    constructor(errors?: string | object | any) {
        super('Invalid image', errors);
    }
}
