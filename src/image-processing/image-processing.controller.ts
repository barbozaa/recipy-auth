import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ImageUtilsService } from './image-utils.service';
import { FileExtension } from 'src/custom-exceptions/file-extension';
import { ImageUploadDto } from 'src/models/image-upload-dto';
import { JwtRefreshAuthGuardGuard } from 'src/jwt-refresh-auth-guard/jwt-refresh-auth-guard.guard';

@Controller('image-processing')
export class ImageProcessingController {
    constructor(private imageSvc: ImageUtilsService) { }

    @Post('upload')
    @UseGuards(JwtRefreshAuthGuardGuard)
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(@UploadedFile() @FileExtension() dto: ImageUploadDto) {
        return await this.imageSvc.compress(dto.image);
    }
}
