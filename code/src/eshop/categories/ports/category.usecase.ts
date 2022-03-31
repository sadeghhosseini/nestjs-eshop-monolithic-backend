import { Category } from "../category.entity";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";

export abstract class CategoryUseCase {
    abstract create(data: CategoryUseCaseType.CreateCategory);
    abstract getAll();
    abstract get(category: Category);
    abstract delete(category: Category);
    abstract update(category: Category, data: CategoryUseCaseType.UpdateCategory);
}


export namespace CategoryUseCaseType {
    export interface CreateCategory {
        title: string;
        description: string;
    }

    export interface UpdateCategory {
        title?: string;
        description?: string;
    }
}