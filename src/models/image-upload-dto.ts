import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { MulterFile } from './images.interface';

export class ImageUploadDto {
    @IsNotEmpty()
    @IsString()
    @IsIn(['.jpeg', '.jpg', '.png'], {
        message: 'Invalid image extension. Only JPEG and PNG are allowed.',
    })
    fileExtension: string;

    image: MulterFile;
}