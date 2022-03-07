import { IsEmail, MinLength } from "class-validator";
import { Unique } from "typeorm";

export class signUpDto {
    @IsEmail()
    @Unique(null)
    email: string;

    @MinLength(8)
    password: string;
}