import {IsArray, IsNumber, IsOptional, IsString, Min, MinLength} from "class-validator";
import {Product} from "../product.entity";
import {Category} from "../../categories/category.entity";
import {Property} from "../../properties/property.entity";
import { IsFile, CanBeForeignKey, MinWordLength, Unique } from "../../custom-validation.decorator";


export class CreateProductDto {
    @IsString()
    @MinLength(3)
    title: string;

    @IsOptional()
    @IsString()
    @MinWordLength(3)
    description: string;

    @Min(0)
    @IsNumber()
    quantity: number;

    @IsNumber()
    price: number;

    @CanBeForeignKey(Category)
    category_id: number;

    @IsOptional()
    @IsArray()
    @IsFile({mime: ['image/jpg', 'image/png']}, {each: true})
    new_images: any[];//array of files

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    @CanBeForeignKey(Property, {each: true})
    image_ids: string[];

    @IsOptional()
    @IsArray()
    @CanBeForeignKey(Property, {each: true})
    property_ids: number[];

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    @Unique({EntityClass: Property, column: 'title'}, {each: true})
    new_properties: string[];
}