import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IdToEntity } from 'src/common/pipes/id-to-entity.pipe';
import { RequirePermissions } from 'src/users/permissions.decorator';
import { PermissionsGuard } from 'src/users/permissions.guard';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertiesService } from './properties.service';
import { Property } from './property.entity';

@Controller()
export class PropertiesController {

    constructor(private service: PropertiesService) {

    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('add-property')
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

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('edit-property-any')
    @Patch('/properties/:id')
    async update(@Param('id', new IdToEntity(Property, ['category'])) property: Property, @Body() body: UpdatePropertyDto) {
        await this.service.update(property, body);
        return;
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('delete-property-any')
    @Delete('/properties/:id')
    async delete(@Param('id', new IdToEntity(Property)) property: Property) {
        await this.service.delete(property);
        return;
    }
}
