import { IsDefined, IsInt, Min, MinLength } from "class-validator";
import { CanBeForeignKey } from "src/custom-validation.decorator";
import { Product } from "src/eshop/products/product.entity";

export class UpdateCartItemDto {

    @CanBeForeignKey(Product, { context: { errorCode: 'cannotBeForeignKey' } })
    @IsDefined({ context: { errorCode: 'notDefined' } })
    product_id: string;

    @IsInt({ context: { errorCode: 'notInt' } })
    @Min(1, { context: { errorCode: 'lessThanMin' } })
    @IsDefined({ context: { errorCode: 'notDefined' } })
    quantity: number;
}