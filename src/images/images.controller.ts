import { Body, Controller, Delete, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FormDataRequest } from 'nestjs-form-data';
import { CreateImageDto } from './dto/create-image.dto';

@Controller()
export class ImagesController {

    @Post('/images')
    @FormDataRequest()
    create(@Body() body: CreateImageDto) {
        console.log('body', body);
        return body;
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
