import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";
import { Category } from "src/eshop/categories/category.entity";
import { CanBeForeignKey } from "src/custom-validation.decorator";

export class UpdatePropertyDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    title: string;

    @IsOptional()
    @IsBoolean()
    is_visible: boolean;

    @IsOptional()
    @CanBeForeignKey(Category)
    category_id: number;
}