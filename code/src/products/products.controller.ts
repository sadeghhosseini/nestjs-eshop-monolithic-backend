import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

@Controller()
export class ProductsController {

    @Post('/products')
    create() {

    }

    @Get('/products')
    getAll() {

    }

    @Get('/products/:id')
    get(@Param('id') productId: string) {

    }

    @Patch('/products/:id')
    update(@Param('id') productId: string) {

    }

    @Delete('/products/:id')
    delete(@Param('id') productId: string) {

    }

    @Get('/products/:id/images')
    getImages(@Param('id') productId: string) {

    }

    @Get('/products/:id/category')
    getCategory(@Param('id') productId: string) {

    }

    @Get('/products/:id/properties')
    getProperties(@Param('id') productId: string) {

    }
}
