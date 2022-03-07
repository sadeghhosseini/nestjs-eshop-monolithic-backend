import { Controller, Get, Param, Patch } from '@nestjs/common';

@Controller()
export class UsersController {

    @Get('/users')
    getAll() {
        
    }
    
    @Get('/users/:id')
    get(@Param('id') userId: string) {
        
    }
    
    @Patch('/users/:id')
    update(@Param('id') userId: string) {

    }
}
