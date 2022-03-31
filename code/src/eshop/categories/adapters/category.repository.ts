import { getManager } from "typeorm";
import { Category } from "../category.entity";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";
import { CategoryProvider, CategoryProviderType } from "../ports/category.provider";


export class CategoryRepository extends CategoryProvider {
    getRecords() {
        return getManager().find(Category);
    }
    createRecord(category: CategoryProviderType.CreateCategory) {
        return getManager().save(Category, category);
    }
    getRecord(category: Category) {
        return getManager().findOne(Category, category);
    }
    deleteRecord(category: Category) {
        return getManager().delete(Category, category);
    }
    updateRecord(category: Category, newCategory: CategoryProviderType.UpdateCategory) {
        return getManager().update(Category, category, newCategory);
    }
}