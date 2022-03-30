import { IsOptional, Max, MaxLength, Min, MinLength } from "class-validator";
import { CanBeForeignKey } from "src/custom-validation.decorator";
import { Comment } from "../comment.entity";

export class CreateCommentDto {

    @MinLength(1)
    @MaxLength(500)
    content: string;
    
    @IsOptional()
    @CanBeForeignKey(Comment)
    parent_id: number;
}