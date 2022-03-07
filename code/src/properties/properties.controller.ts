import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

@Controller()
export class PropertiesController {

    @Post('/properties')
    create() {

    }

    @Get('/properties')
    getAll() {

    }

    @Get('/properties/:id')
    get(@Param('id') propertyId: string) {

    }

    @Patch('/properties/:id')
    update(@Param('id') propertyId: string) {

    }

    @Delete('/properties/:id')
    delete(@Param('id') propertyId: string) {

    }
}
