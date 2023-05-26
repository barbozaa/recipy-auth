import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { InvalidImageException } from 'src/custom-exceptions/invalid-image-exception';
import { MulterFile } from 'src/models/images.interface';

@Injectable()
export class ImageUtilsService {
    PATH = 'public/';
    constructor() { }

    /**
     * Compress
     * 
     * @summary This function takes the uploaded image buffer and compress it and save it on the public path
     * @param image: MulterFile
     * @returns Promise<string>
     */
    async compress(image: MulterFile): Promise<string> {
        const imageExtension = image.originalname.split('.')[1];
        if (imageExtension) {
            switch (imageExtension.toLowerCase()) {
                case 'jpg':
                    return await this.compressJPEG(image);
                case 'png':
                    return await this.compressPNG(image);
                default:
                    break;
            }
        }
    }

    private compressJPEG(image: MulterFile): Promise<string> {
        return new Promise(async (res, rej) => {
            try {
                await sharp(image.path)
                    .resize(800, 600)
                    .jpeg({ quality: 80 })
                    .toFile(`${this.PATH}compressed_${image.originalname.split('.')[0]}.jpg`);
                res(`compressed_${image.originalname}`);
            } catch (error) {
                rej(error.message);
            }
        });
    }

    private compressPNG(image: MulterFile): Promise<string> {
        return new Promise(async (res, rej) => {
            try {
                await sharp(image.path)
                    .png({ compressionLevel: 3, adaptiveFiltering: false, force: true, quality: 6 })
                    .toFile(`${this.PATH}compressed_${image.originalname}`);
                res(`compressed_${image.originalname}`);
            } catch (error) {
                rej(error.message);
            }
        });
    }
}
