import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

interface CategoryType {
    title: string,
    description: string,
}

@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    ) {

    }

    create(body: CategoryType): Promise<any> {
        return this.categoryRepository.save(body);
    }

    getAll(): Promise<any> {
        return this.categoryRepository.find();
    }

    get(categoryId: string): Promise<any> {
        return this.categoryRepository.findOne(categoryId);
    }

    async delete(categoryId: string): Promise<any> {
        return await this.categoryRepository.delete(categoryId);
    }

    update(categoryId: string, body: CategoryType): Promise<any> {
        return this.categoryRepository.update(categoryId, body);
    }
}
