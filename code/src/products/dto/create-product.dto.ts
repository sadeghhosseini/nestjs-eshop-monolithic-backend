import { IsArray, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";
import { IsFile, CanBeForeignKey, MinWordLength, Unique } from "src/custom-validation.decorator";


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

    @CanBeForeignKey(null)
    category_id: string;

    @IsOptional()
    @IsArray()
    @IsFile({ mime: ['image/jpg', 'image/png'] }, { each: true })
    new_images: any[];//array of files

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @CanBeForeignKey(null, { each: true })
    image_ids: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @CanBeForeignKey(null, { each: true })
    property_ids: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Unique(null, { each: true })
    new_properties: string[];
}