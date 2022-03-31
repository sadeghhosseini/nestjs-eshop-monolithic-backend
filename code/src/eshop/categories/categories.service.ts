import { Injectable } from '@nestjs/common';
import { Category } from './category.entity';
import { CategoryProvider } from './ports/category.provider';
import { CategoryUseCase, CategoryUseCaseType } from './ports/category.usecase';


@Injectable()
export class CategoriesService implements CategoryUseCase {

    constructor(
        private categoryProvider: CategoryProvider,
    ) {

    }

    create(body: CategoryUseCaseType.CreateCategory): Promise<any> {
        return this.categoryProvider.createRecord(body);
    }

    getAll(): Promise<any> {
        return this.categoryProvider.getRecords();
    }

    get(category: Category): Promise<any> {
        return this.categoryProvider.getRecord(category);
    }

    async delete(category: Category): Promise<any> {
        return await this.categoryProvider.deleteRecord(category);
    }

    update(category: Category, body: CategoryUseCaseType.UpdateCategory): Promise<any> {
        return this.categoryProvider.updateRecord(category, body);
    }
}
