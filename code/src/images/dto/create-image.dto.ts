import { Type } from "class-transformer";
import { IsDefined, IsOptional, IsString, ValidateNested } from "class-validator";
import { HasMimeType, IsFile, MaxFileSize } from "nestjs-form-data";
// import { IsFile } from "src/custom-validation.decorator";

class Image {
    // @IsFile({ mime: ['image/jpg', 'image/png'], max: 500 }, { context: { errorCode: 'wrongFileFormat' } })
    @IsFile({ context: { errorCode: 'notFile' } })
    @MaxFileSize(15 * 10 ** 3, { context: { errorCode: 'fileSizeExceeded' } })
    @HasMimeType(['image/jpeg', 'image/png'], { context: { errorCode: 'wrongFileFormat' } })
    // @IsFile({mime: ['image/jpeg', 'image/jpg', 'image/png'], max: 20 * (10**3)})
    @IsDefined({ context: { errorCode: 'notDefined' } })
    file: any;

    @IsString({ context: { errorCode: 'notString' } })
    @IsOptional()
    path: string;
}

export class CreateImageDto {
    @IsDefined({ context: { errorCode: 'notDefined' } })
    @ValidateNested({ each: true })
    @Type(() => Image)
    images: Image[];
}