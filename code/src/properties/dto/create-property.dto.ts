import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";
import { CanBeForeignKey } from "src/custom-validation.decorator";

export class CreatePropertyDto {
    @IsString()
    @MinLength(3)
    title: string;

    @IsOptional()
    @IsBoolean()
    is_visible: boolean;


    @CanBeForeignKey(null)
    category_id: string;
}