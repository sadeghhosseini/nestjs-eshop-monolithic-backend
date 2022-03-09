import { IsOptional, Max, MaxLength, Min, MinLength } from "class-validator";
import { CanBeForeignKey } from "../../custom-validation.decorator";

export class CreateCommentDto {

    @MinLength(1)
    @MaxLength(500)
    content: string;
    
    @IsOptional()
    @CanBeForeignKey(null)
    parent_id: string;
}