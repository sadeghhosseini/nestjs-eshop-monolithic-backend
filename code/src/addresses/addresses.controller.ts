import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { IdToEntity } from 'src/common/pipes/id-to-entity.pipe';
import { Address } from './address.entity';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller()
export class AddressesController {

    constructor(private addressesService: AddressesService) {

    }

    @Post('/addresses')
    async create(@Body() address: CreateAddressDto) {
        await this.addressesService.create(address);
        return;
    }

    @Get('/addresses')
    async getAll() {
        return await this.addressesService.getAll();
    }
    
    @Get('/addresses/:id')
    async get(@Param('id', new IdToEntity(Address)) address: Address) {
        return await this.addressesService.get(address);
    }
    
    @Patch('/addresses/:id')
    async update(@Param('id', new IdToEntity(Address)) address: Address, @Body() newAddressInfo: UpdateAddressDto) {
        await this.addressesService.update(address, newAddressInfo);
        return;
    }
    
    @Delete('/addresses/:id')
    async delete(@Param('id', new IdToEntity(Address)) address: Address) {
        await this.addressesService.delete(address);
        return;
    }
}
