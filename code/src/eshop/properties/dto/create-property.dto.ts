import { IsBoolean, IsDefined, IsOptional, IsString, MinLength } from "class-validator";
import { Category } from "src/eshop/categories/category.entity";
import { CanBeForeignKey } from "src/custom-validation.decorator";

export class CreatePropertyDto {
    @IsString()
    @MinLength(3)
    @IsDefined()
    title: string;

    @IsBoolean()
    @IsDefined()
    is_visible: boolean;


    @CanBeForeignKey(Category)
    @IsDefined()
    category_id: number;
}