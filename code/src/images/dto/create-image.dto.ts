import { Type } from "class-transformer";
import { IsDefined, IsOptional, IsString, ValidateNested } from "class-validator";
import { HasMimeType, IsFile, MaxFileSize } from "nestjs-form-data";

class Image {
    // @IsFile({ mime: ['image/jpg', 'image/png'], max: 500 }, { context: { errorCode: 'wrongFileFormat' } })
    @IsFile({ context: { errorCode: 'notFile' } })
    @MaxFileSize(15 * 10 ** 3, { context: { errorCode: 'fileSizeExceeded' } })
    @HasMimeType(['image/jpeg', 'image/png'], { context: { errorCode: 'wrongFileFormat' } })
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