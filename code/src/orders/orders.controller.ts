import { Controller, Get, Param, Patch, Post } from '@nestjs/common';

@Controller()
export class OrdersController {

    @Post('/orders')
    create() {

    }

    @Get('/orders')
    getAll() {

    }

    @Get('/orders/:id')
    get(@Param('id') orderId: string) {

    }

    @Patch('/orders/:id')
    update(@Param('id') orderId: string) {

    }

    @Get('/orders/:id/items')
    getItems(@Param('id') orderId: string) {

    }
}
