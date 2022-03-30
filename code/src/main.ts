import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { permissionSeeder } from './users/permission.seed';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // const configService = app.get(ConfigService); for using configService in matin.ts
  await permissionSeeder.seed();
  await app.listen(3000);
}
bootstrap();
