import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { CommentsController } from './comments.controller';

describe('CommentsController', () => {
  let controller: CommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).to.exist;
  });
});
