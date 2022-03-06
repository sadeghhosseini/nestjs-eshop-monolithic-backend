import { IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {

    @IsString()
    title: string;

    @IsOptional()
    description: string;
}