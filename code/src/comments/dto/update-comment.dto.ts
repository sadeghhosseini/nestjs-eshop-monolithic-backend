import { MaxLength, MinLength } from "class-validator";
import { CanBeForeignKey } from "src/custom-validation.decorator";
import { Product } from "src/products/product.entity";

export class UpdateCommentDto {

    @MinLength(1)
    @MaxLength(500)
    content: string;

    @CanBeForeignKey(Product)
    product_id: string;

}