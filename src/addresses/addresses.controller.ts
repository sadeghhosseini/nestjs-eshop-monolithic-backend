import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

@Controller()
export class AddressesController {
    @Post('/addresses')
    create() {

    }

    @Get('/addresses')
    getAll() {

    }

    @Get('/addresses/:id')
    get(@Param('id') addressId: string) {

    }

    @Patch('/addresses/:id')
    update(@Param('id') addressId: string) {

    }

    @Delete('/addresses/:id')
    delete(@Param('id') addressId: string) {

    }
}
