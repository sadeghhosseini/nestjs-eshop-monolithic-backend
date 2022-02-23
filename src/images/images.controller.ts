import { Controller, Delete, Get, Param, Post } from '@nestjs/common';

@Controller()
export class ImagesController {

    @Post('/images')
    create() {

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
