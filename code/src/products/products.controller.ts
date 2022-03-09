import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {CreateProductDto} from "./dto/create-product.dto";
import {ProductsService} from "./products.service";

@Controller()
export class ProductsController {
    constructor(private service: ProductsService) {
    }
    @Post('/products')
    async create(@Body() body: CreateProductDto) {
        await this.service.create(body);
        return;
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
