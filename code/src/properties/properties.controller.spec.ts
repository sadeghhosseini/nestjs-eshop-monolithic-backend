import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { PropertiesController } from './properties.controller';

describe('PropertiesController', () => {
  let controller: PropertiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertiesController],
    }).compile();

    controller = module.get<PropertiesController>(PropertiesController);
  });

  it('should be defined', () => {
    expect(controller).to.exist;
  });
});
