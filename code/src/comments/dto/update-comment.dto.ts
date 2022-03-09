import { MaxLength, MinLength } from "class-validator";
import { CanBeForeignKey } from "../../custom-validation.decorator";

export class UpdateCommentDto {

    @MinLength(1)
    @MaxLength(500)
    content: string;

    @CanBeForeignKey(null)
    product_id: string;

}