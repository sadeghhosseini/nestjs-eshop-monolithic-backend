import { IsEmail, MinLength } from "class-validator";
import { Unique } from "src/custom-validation.decorator";
import { User } from "src/users/user.entity";

export class signUpDto {
    @IsEmail()
    @Unique({ EntityClass: User, column: 'email' }, { context: { errorCode: 'NotUnique'} })
    email: string;

    @MinLength(8)
    password: string;
}