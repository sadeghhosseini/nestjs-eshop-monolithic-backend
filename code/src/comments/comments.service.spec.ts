import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { CommentsService } from './comments.service';

describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentsService],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).to.exist;
  });
});
