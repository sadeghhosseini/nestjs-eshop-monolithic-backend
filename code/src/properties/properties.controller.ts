import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { IdToEntity } from 'src/common/pipes/id-to-entity.pipe';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertiesService } from './properties.service';
import { Property } from './property.entity';

@Controller()
export class PropertiesController {

    constructor(private service: PropertiesService) {

    }
    @Post('/properties')
    async create(@Body() body: CreatePropertyDto) {
        await this.service.create(body);
        return;
    }

    @Get('/properties')
    async getAll() {
        return await this.service.get();
    }

    @Get('/properties/:id')
    get(@Param('id', new IdToEntity(Property)) property: Property) {
        return property;
    }

    @Patch('/properties/:id')
    async update(@Param('id', new IdToEntity(Property, ['category'])) property: Property, @Body() body: UpdatePropertyDto) {
        await this.service.update(property, body);
        return;
    }

    @Delete('/properties/:id')
    async delete(@Param('id', new IdToEntity(Property)) property: Property) {
        await this.service.delete(property);
        return;
    }
}
