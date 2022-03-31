import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {JwtAuthGuard} from 'src/auth/jwt-auth.guard';
import { IdToEntity } from 'src/common/pipes/id-to-entity.pipe';
import {RequirePermissions} from 'src/users/permissions.decorator';
import {PermissionsGuard} from 'src/users/permissions.guard';
import {Repository} from 'typeorm';
import {CategoriesService} from '../categories.service';
import {Category} from '../category.entity';
import {CreateCategoryDto} from '../dto/create-category.dto';
import {UpdateCategoryDto} from '../dto/update-category.dto';
import { CategoryUseCase } from '../ports/category.usecase';

@Controller()
export class CategoriesController {

    constructor(
        private usecases: CategoryUseCase,
    ) {

    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('add-category')
    @Post('/categories')
    async create(@Body() body: CreateCategoryDto) {
        await this.usecases.create(body);
        return;
    }

    @Get('/categories')
    async getAll() {
        return await this.usecases.getAll();
    }

    @Get('/categories/:id')
    async get(@Param('id', new IdToEntity(Category)) category: Category) {
        return await this.usecases.get(category);
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('delete-category-any')
    @Delete('/categories/:id')
    async delete(@Param('id', new IdToEntity(Category)) category: Category) {
        await this.usecases.delete(category);
        return;
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('edit-category-any')
    @Patch('/categories/:id')
    async update(@Param('id', new IdToEntity(Category)) category: Category, @Body() body: UpdateCategoryDto) {
        await this.usecases.update(category, body);
        return;
    }

    @Get('/categories/:id/products')
    getProducts(@Param('id', new IdToEntity(Category)) category: Category) {

    }

    @Get('/categories/:id/properties')
    getProperties(@Param('id', new IdToEntity(Category)) category: Category) {

    }
}
