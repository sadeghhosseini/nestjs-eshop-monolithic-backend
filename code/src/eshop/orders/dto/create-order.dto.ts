import { CanBeForeignKey } from "src/custom-validation.decorator";

export class CreateOrderDto {
    @CanBeForeignKey(null)
    address_id: string;
}