import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { CartsController } from './carts.controller';

describe('CartsController', () => {
  let controller: CartsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartsController],
    }).compile();

    controller = module.get<CartsController>(CartsController);
  });

  it('should be defined', () => {
    expect(controller).to.exist;
  });
});
