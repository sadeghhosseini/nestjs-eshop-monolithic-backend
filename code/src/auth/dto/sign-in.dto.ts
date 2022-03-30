import { IsDefined, IsEmail, IsString } from "class-validator";

export class SignInDto {

    @IsEmail()
    @IsDefined()
    email: string;
    
    @IsString()
    @IsDefined()
    password: string;
}