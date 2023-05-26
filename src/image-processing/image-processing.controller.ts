import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ImageUtilsService } from './image-utils.service';
import { FileExtension } from 'src/custom-exceptions/file-extension';
import { ImageUploadDto } from 'src/models/image-upload-dto';

@Controller('image-processing')
export class ImageProcessingController {
    constructor(private imageSvc: ImageUtilsService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(@UploadedFile() @FileExtension() dto: ImageUploadDto) {
        return await this.imageSvc.compress(dto.image);
    }
}
