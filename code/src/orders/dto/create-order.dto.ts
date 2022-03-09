import { CanBeForeignKey } from "../../custom-validation.decorator";

export class CreateOrderDto {
    @CanBeForeignKey(null)
    address_id: string;
}