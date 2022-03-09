import { IsString } from "class-validator";
import { DoesImageAlreadyExist } from "../../custom-validation.decorator";

export class UpdateImageDto {
    @IsString()
    @DoesImageAlreadyExist()
    path: string;
}