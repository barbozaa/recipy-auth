import { Test, TestingModule } from '@nestjs/testing';
import { ImageUtilsService } from './image-utils.service';

describe('ImageUtilsService', () => {
  let service: ImageUtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageUtilsService],
    }).compile();

    service = module.get<ImageUtilsService>(ImageUtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
