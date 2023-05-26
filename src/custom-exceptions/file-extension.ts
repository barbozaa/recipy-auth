import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { validate } from 'class-validator';
import { ImageUploadDto } from 'src/models/image-upload-dto';
import { MulterFile } from 'src/models/images.interface';
import { InvalidImageException } from './invalid-image-exception';

export const FileExtension = createParamDecorator(async (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const image: MulterFile = request.file;

    const dto = new ImageUploadDto();
    dto.fileExtension = image.originalname.substring(image.originalname.lastIndexOf('.')).toLowerCase();
    dto.image = image;

    const error = await validate(dto);
    if (error.length > 0) {
        throw new InvalidImageException(error[0].constraints.isIn);
    }
    return dto;
});
