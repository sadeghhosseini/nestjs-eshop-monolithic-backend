import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller()
export class CategoriesController {

    constructor(
        private service: CategoriesService,
    ) {

    }
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

    @Delete('/categories/:id')
    async delete(@Param('id') categoryId: string) {
        await this.service.delete(categoryId);
        return;
    }

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
