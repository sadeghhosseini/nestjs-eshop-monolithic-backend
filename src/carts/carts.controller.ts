import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Patch, Post } from '@nestjs/common';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller()
export class CartsController {

    @Post('/carts/items')
    addItem() {
    }

    @Get('/carts/items')
    getItems() {
        return 'ok';
    }

    @Delete('/carts/items/:id')
    deleteItem(@Param('id') productId: string) {

    }

    @Patch('/carts/items/:id')
    updateItem(@Param('id') productId: string, @Body() body: UpdateCartItemDto) {
        return 'update-cart-item';
    }

    /**
     * 
     */
    @Patch('/carts/items')
    updateItems(
        @Body(new ParseArrayPipe({ items: UpdateCartItemDto }))
        items: UpdateCartItemDto[]
    ) {

    }
}
