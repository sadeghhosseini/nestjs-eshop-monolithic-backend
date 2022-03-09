import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { ImagesService } from './images.service';

describe('ImagesService', () => {
  let service: ImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagesService],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
  });

  it('should be defined', () => {
    expect(service).to.exist;
  });
});
