import { Module } from '@nestjs/common';
import { ImageUtilsService } from './image-utils.service';
import { ImageProcessingController } from './image-processing.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        MulterModule.register({
            dest: '../public/',
        }),
    ],
    providers: [ImageUtilsService],
    controllers: [ImageProcessingController]
})
export class ImageProcessingModule { }
