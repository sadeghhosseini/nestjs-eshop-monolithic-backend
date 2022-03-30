import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {JwtAuthGuard} from 'src/auth/jwt-auth.guard';
import {RequirePermissions} from 'src/users/permissions.decorator';
import {PermissionsGuard} from 'src/users/permissions.guard';
import {Repository} from 'typeorm';
import {CategoriesService} from './categories.service';
import {Category} from './category.entity';
import {CreateCategoryDto} from './dto/create-category.dto';
import {UpdateCategoryDto} from './dto/update-category.dto';

@Controller()
export class CategoriesController {

    constructor(
        private service: CategoriesService,
    ) {

    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('add-category')
    @Post('/categories')
    async create(@Body() body: CreateCategoryDto) {
        await this.service.create(body);
        return;
    }

    @Get('/categories')
    async getAll() {
        return await this.service.getAll();
    }

    @Get('/categories/:id')
    async get(@Param('id') categoryId: string) {
        return await this.service.get(categoryId);
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('delete-category-any')
    @Delete('/categories/:id')
    async delete(@Param('id') categoryId: string) {
        await this.service.delete(categoryId);
        return;
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('edit-category-any')
    @Patch('/categories/:id')
    async update(@Param('id') categoryId: string, @Body() body: UpdateCategoryDto) {
        await this.service.update(categoryId, body);
        return;
    }

    @Get('/categories/:id/products')
    getProducts(@Param('id') categoryId: string) {

    }

    @Get('/categories/:id/properties')
    getProperties(@Param('id') categoryId: string) {

    }
}
