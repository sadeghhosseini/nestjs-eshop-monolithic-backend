import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IdToEntity } from 'src/common/pipes/id-to-entity.pipe';
import { RequirePermissions } from 'src/users/permissions.decorator';
import { Address } from './address.entity';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import {PermissionsGuard} from "../../users/permissions.guard";

@Controller()
export class AddressesController {

    constructor(private addressesService: AddressesService) {

    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('add-address-own')
    @Post('/addresses')
    async create(@Request() request, @Body() address: CreateAddressDto) {
        await this.addressesService.create(request.user, address);
        return;
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('view-address-own', 'view-address-any')
    @Get('/addresses')
    async getAll(@Request() request: any) {
        return await this.addressesService.getAll(request.user);
    }
    
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('view-address-own', 'view-address-any')
    @Get('/addresses/:id')
    async get(@Request() request, @Param('id', new IdToEntity(Address, ['customer'])) address: Address) {
        return this.addressesService.get(request.user, address);
    }
    
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('edit-address-own')
    @Patch('/addresses/:id')
    async update(@Request() request, @Param('id', new IdToEntity(Address, ['customer'])) address: Address, @Body() newAddressInfo: UpdateAddressDto) {
        await this.addressesService.update(request.user, address, newAddressInfo);
        return;
    }
    
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('delete-address-own')
    @Delete('/addresses/:id')
    async delete(@Request() request, @Param('id', new IdToEntity(Address, ['customer'])) address: Address) {
        await this.addressesService.delete(request.user, address);
        return;
    }
}
