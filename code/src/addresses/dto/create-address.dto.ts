import { IsDefined, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { Column } from "typeorm";

export class CreateAddressDto {
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    @IsDefined()
    province: string;
    
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    @IsDefined()
    city: string;
    
    @IsString()
    @MinLength(5)
    @MaxLength(200)
    @IsDefined()
    rest_of_address: string;
    
    @MinLength(5)
    @MaxLength(100)
    @IsDefined()
    postal_code: string;
}