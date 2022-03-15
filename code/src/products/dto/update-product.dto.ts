import { IsArray, IsOptional, IsString, Min, MinLength } from "class-validator";
import { Category } from "src/categories/category.entity";
import { IsFile, CanBeForeignKey, MinWordLength, Unique, HasMimeType, MaxFileSize } from "src/custom-validation.decorator";
import { Image } from "src/images/image.entity";
import { Property } from "src/properties/property.entity";

export class UpdateProductDto {

    @IsOptional()
    @MinLength(3)
    title: string;

    @IsOptional()
    @MinWordLength(3)
    description: string;

    @IsOptional()
    @Min(0)
    quantity: number;

    @IsOptional()
    price: number;

    @IsOptional()
    @CanBeForeignKey(Category)
    category_id: number;

    @IsOptional()
    @IsArray()
    @IsFile({ each: true })
    @HasMimeType(['image/jpg', 'image/png'], { each: true })
    @MaxFileSize(150 * (10 ** 3), { each: true })//150kb
    new_images: any[];//array of files

    @IsOptional()
    @IsArray()
    @CanBeForeignKey(Image, { each: true })
    image_ids: string[];

    @IsOptional()
    @IsArray()
    @CanBeForeignKey(Property, { each: true })
    property_ids: number[];

    @IsOptional()
    @IsArray()
    @MinLength(2, { each: true })
    @IsString({ each: true })
    @Unique({ EntityClass: Property, column: 'title' }, { each: true })
    new_properties: string[];
}