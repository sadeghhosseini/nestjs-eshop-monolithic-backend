import { IsString } from "class-validator";
import { DoesImageAlreadyExist } from "src/custom-validation.decorator";

export class UpdateImageDto {
    @IsString()
    @DoesImageAlreadyExist()
    path: string;
}