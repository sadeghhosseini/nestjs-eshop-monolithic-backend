import { IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateAddressDto {
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    province: string;
    
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    city: string;
    
    @IsString()
    @MinLength(5)
    @MaxLength(200)
    rest_of_address: string;

    @MinLength(5)
    @MaxLength(100)
    postal_code: string;
}