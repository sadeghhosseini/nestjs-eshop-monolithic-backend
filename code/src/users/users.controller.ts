import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequirePermissions } from './permissions.decorator';
import { PermissionsGuard } from './permissions.guard';

@Controller()
export class UsersController {

    @Get('/users')
    getAll() {
        
    }
    
    @Get('/users/:id')
    get(@Param('id') userId: string) {
        
    }
    
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('edit-user(name)-own')
    @Patch('/users/:id')
    update(@Param('id') userId: string) {

    }
}
