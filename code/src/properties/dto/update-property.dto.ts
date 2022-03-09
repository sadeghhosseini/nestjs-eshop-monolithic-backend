import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";
import { CanBeForeignKey } from "../../custom-validation.decorator";

export class UpdatePropertyDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    title: string;

    @IsOptional()
    @IsBoolean()
    is_visible: boolean;

    @IsOptional()
    @CanBeForeignKey(null)
    category_id: string;
}