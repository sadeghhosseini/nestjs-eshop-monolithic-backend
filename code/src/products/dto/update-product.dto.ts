import { IsArray, IsOptional, IsString, Min, MinLength } from "class-validator";
import { IsFile, CanBeForeignKey, MinWordLength, Unique } from "../../custom-validation.decorator";

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
    price: string;

    @IsOptional()
    @CanBeForeignKey(null)
    category_id: string;

    @IsOptional()
    @IsArray()
    @IsFile({ mime: ['image/jpg', 'image/png'] }, { each: true })
    new_images: any[];//array of files

    @IsOptional()
    @IsArray()
    @CanBeForeignKey(null, { each: true })
    image_ids: string[];

    @IsOptional()
    @IsArray()
    @CanBeForeignKey(null, { each: true })
    property_ids: string[];

    @IsOptional()
    @IsArray()
    @MinLength(2, { each: true })
    @IsString({ each: true })
    @Unique(null, { each: true })
    new_properties: string[];
}