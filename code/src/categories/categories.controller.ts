import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

@Controller()
export class CategoriesController {

    @Post('/categories')
    create() {

    }

    @Get('/categories')
    getAll() {

    }

    @Get('/categories/:id')
    get(@Param('id') categoryId: string) {

    }

    @Delete('/categories/:id')
    delete(@Param('id') categoryId: string) {

    }

    @Patch('/categories/:id')
    update(@Param('id') categoryId: string) {

    }

    @Get('/categories/:id/products')
    getProducts(@Param('id') categoryId: string) {

    }

    @Get('/categories/:id/properties')
    getProperties(@Param('id') categoryId: string) {

    }
}
