import { Body, Controller, Delete, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { FormDataRequest } from 'nestjs-form-data';
import { Repository } from 'typeorm';
import { CreateImageDto } from './dto/create-image.dto';
import { Image } from './image.entity';

@Controller()
export class ImagesController {
    constructor(
        @InjectRepository(Image)
        private repository: Repository<Image>
    ) {

    }
    @Post('/images')
    @FormDataRequest()
    create(@Body() body: CreateImageDto) {
        //upload the image
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
