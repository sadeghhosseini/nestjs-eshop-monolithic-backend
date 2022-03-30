import { IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

export class UpdateAddressDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    province: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    city: string;

    @IsOptional()
    @IsString()
    @MinLength(5)
    @MaxLength(200)
    rest_of_address: string;
    
    @IsOptional()
    @MinLength(5)
    @MaxLength(100)
    postal_code: string;
}