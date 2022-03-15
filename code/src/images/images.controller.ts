import { Body, Controller, Delete, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { promises } from 'fs';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import { Repository } from 'typeorm';
import { CreateImageDto } from './dto/create-image.dto';
import { Image } from './image.entity';

@Controller()
export class ImagesController {
    constructor(
        @InjectRepository(Image)
        private repository: Repository<Image>,
        private configService: ConfigService,
    ) {

    }
    @Post('/images')
    @FormDataRequest()
    async create(@Body() body: CreateImageDto) {
        console.log(body);
        //upload the image
        for (const image of body.images) {
            const file = image.file as MemoryStoredFile;
            const timestamp = Date.now();
            const fileName = `${image.path}_${timestamp}.${file.mimetype.split('/')[1]}`;
            await promises.writeFile(this.configService.get<string>('UPLOAD_PATH') + '/' + fileName, file.buffer);
        }
        //save the path into the database
        /* for (const image of body.images) {
            this.repository.save({
                path: image.path,
            });
        } */
    }

    @Get('/images')
    getAll() {

    }

    @Get('/images/:id')
    get(@Param('id') imageId: string) {

    }

    @Delete('/images/:id')
    delete(@Param('id') imageId: string) {

    }

    @Get('/images/:id/products')
    getProducts(@Param('id') imageId: string) {

    }
}
