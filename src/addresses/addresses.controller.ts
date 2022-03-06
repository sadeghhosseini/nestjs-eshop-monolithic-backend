import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AddressesService } from './addresses.service';

@Controller()
export class AddressesController {

    constructor(private addressesService: AddressesService) {

    }

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
