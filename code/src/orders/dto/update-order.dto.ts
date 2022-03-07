import { IsDefined, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";
import { CanBeForeignKey } from "src/custom-validation.decorator";

/**
 * 
 * @param o 
 * @returns true if exists and false if does not exist
 */
const doesNotHaveAddressId = (o: UpdateOrderDto): boolean => (
    !o.hasOwnProperty('address_id')
    //TODO && user has permission edit-order(address)-own
)

const doesNotHaveAddressInfo = (o: UpdateOrderDto): boolean => (
    o.hasOwnProperty('province') &&
    o.hasOwnProperty('city') &&
    o.hasOwnProperty('rest_of_address') &&
    o.hasOwnProperty('postal_code')
    //TODO && user has permission edit-order(address)-own
);

const hasEditOrderStatusAnyPermission = (o: UpdateOrderDto) => (
    true //TODO if user has edit-order(status)-any permission
    
)
export class UpdateOrderDto {
    @ValidateIf((o: UpdateOrderDto) => false)//required if user has permissions of edit-order(status)-any
    @IsDefined()
    status: string;

    @ValidateIf(doesNotHaveAddressInfo)
    @CanBeForeignKey(null)
    @IsDefined()
    address_id: string;

    @ValidateIf(doesNotHaveAddressId)
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    province: string;

    @ValidateIf(doesNotHaveAddressId)
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    city: string;

    @ValidateIf(doesNotHaveAddressId)
    @IsString()
    @MinLength(5)
    @MaxLength(200)
    rest_of_address: string;

    @ValidateIf(doesNotHaveAddressId)
    @MinLength(5)
    @MaxLength(100)
    postal_code: string;
}


