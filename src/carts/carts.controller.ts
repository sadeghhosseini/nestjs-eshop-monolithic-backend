import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

@Controller()
export class CartsController {

    @Post('/carts/items')
    addItem() {

    }

    @Get('/carts/items')
    getItems() {

    }

    @Delete('/carts/items/:id')
    deleteItem(@Param('id') productId: string) {

    }

    @Patch('/carts/items/:id')
    updateItem(@Param('id') productId: string) {

    }

    @Patch('/carts/items')
    updateItems() {

    }
}
