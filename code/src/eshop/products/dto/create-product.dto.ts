import { IsArray, IsDefined, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";
import { CanBeForeignKey, MinWordLength, Unique, IsFile, HasMimeType, MaxFileSize } from "src/custom-validation.decorator";
import { Product } from "../product.entity";
import { Category } from "../../categories/category.entity";
import { Property } from "../../properties/property.entity";
// import { HasMimeType, IsFile, MaxFileSize } from "nestjs-form-data";


export class CreateProductDto {
    @IsString()
    @MinLength(3)
    @IsDefined()
    title: string;

    @IsOptional()
    @IsString()
    @MinWordLength(3)
    @IsDefined()
    description: string;

    @Min(0)
    @IsNumber()
    @IsDefined()
    quantity: number;

    @IsNumber()
    @IsDefined()
    price: number;

    @CanBeForeignKey(Category)
    @IsDefined()
    category_id: number;

    /*     @IsOptional()
        @IsArray()
        @IsFile({ each: true })
        @MaxFileSize(20 * (10 ** 3), { each: true })
        @HasMimeType(['image/jpeg', 'image/png'], { each: true }) */
    /* @IsFile({
        mime: ['image/jpeg', 'image/png'], 
        max: 20 * (10**3),//in bytes
    }, {
        each: true,
    }) */
    @IsFile({ each: true })
    @MaxFileSize(150 * (10 ** 3), { each: true })
    @HasMimeType(['image/jpeg', 'image/png'], { each: true })
    @IsOptional()
    new_images: any[];//array of files

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @CanBeForeignKey(Property, { each: true })
    image_ids: string[];

    @IsOptional()
    @IsArray()
    @CanBeForeignKey(Property, { each: true })
    property_ids: number[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Unique({ EntityClass: Property, column: 'title' }, { each: true })
    new_properties: string[];
}