import { Category } from "../category.entity";

export abstract class CategoryProvider {
    abstract getRecords();
    abstract createRecord(category: CategoryProviderType.CreateCategory);
    abstract getRecord(category: Category);
    abstract deleteRecord(category: Category);
    abstract updateRecord(category: Category, newCategory: CategoryProviderType.UpdateCategory);
}

export namespace CategoryProviderType {
    export interface CreateCategory {
        title: string;
        description: string;
    }

    export interface UpdateCategory {
        title?: string;
        description?: string;
    }
}