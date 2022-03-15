import { InternalServerErrorException } from "@nestjs/common";
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
// import {fileTypeFromBuffer} from 'file-type';
import { Connection, Entity, EntityTarget, getConnection, getRepository } from "typeorm";

export function CanBeForeignKey(EntityClass: EntityTarget<unknown>, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        return registerDecorator({
            name: 'canBeForeinKey',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [EntityClass],
            options: validationOptions,
            validator: {
                validate: async (value: any, args: ValidationArguments) => {
                    if (!EntityClass) {
                        throw new InternalServerErrorException(null, 'null passed as EntityClass to @CanBeForeignKey');
                    }
                    const connection = getConnection();
                    const repository = connection.getRepository(EntityClass);
                    try {
                        const record = await repository.findOne(value);
                        if (record) {
                            return true;
                        } else {
                            return false;
                        }
                    } catch (e) {
                        return false;
                    }
                }
                //TODO implement - link -> https://github.com/typestack/class-validator#custom-validation-decorators
                // throw new Error('Not Implemented');
            },
        });
    }
}

interface IsFileOptions {
    mime: ('image/jpg' | 'image/png' | 'image/jpeg')[];
    max?: number;
}

/**
 * https://en.wikipedia.org/wiki/Magic_number_(programming)#Magic_numbers_in_files
 * all jpg files represented as hex start with ffd8 and end with ffd9 
 * @param buffer 
 * @returns 
 */
const isJpg = (buffer: Buffer) => {
    const hex = buffer.toString('hex').toLowerCase();
    return hex.startsWith('ffd8') && hex.endsWith('ffd9');
}
/**
 * https://en.wikipedia.org/wiki/Magic_number_(programming)#Magic_numbers_in_files
 * all jpg files represented as hex start with ffd8 and end with ffd9 
 * @param buffer 
 * @returns 
 */
const isPng = (buffer: Buffer) => {
    const hex = buffer.toString('hex').toLowerCase();
    return hex.startsWith('89504e470d0a1a0a') && hex.endsWith('49454e44ae426082');
}

type FileTypes = 'image/png' | 'image/jpg' | 'image/jpeg';

const getFileType = (buffer: Buffer): FileTypes => {
    if (isPng(buffer)) {
        return 'image/png';
    } else if (isJpg(buffer)) {
        return 'image/jpg';
    }
    throw 'file type is not implemented';
}

interface UploadFileType {
    buffer: Buffer;
    encoding: string;
    fieldname: string;
    mimetype: 'image/jpg' | 'image/png' | 'image/jpeg';
    originalname: string;
    size: number;
}
export function IsFile(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        return registerDecorator({
            name: 'isFile',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: UploadFileType | Buffer, args: ValidationArguments) {
                    if (value instanceof Buffer) {
                        return true;
                    }
                    if (value && value?.buffer instanceof Buffer) {
                        return true;
                    }
                    return false;
                },
            }
        });
    }
}
export function HasMimeType(allowedMimeTypes: Array<FileTypes>, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        return registerDecorator({
            name: 'isFile',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: UploadFileType | Buffer, args: ValidationArguments) {
                    if (!value) {
                        return false;
                    }

                    const input = value as any;
                    const fileType = input?.mimetype || getFileType(input);
                    const isMimeTypeOk = (allowedMimeTypes ?? []).includes(fileType);
                    return isMimeTypeOk;

                    /* if ('mimetype' in value && 'buffer' in value && 'size' in value) {
                        let isMimeTypeOk = value?.mimetype && (allowedMimeTypes ?? []).includes(value.mimetype);
                        return isMimeTypeOk;
                    } else if (value instanceof Buffer) {
                        const fileType = getFileType(value);
                        const isMimeTypeOk = (allowedMimeTypes ?? []).includes(fileType);
                        return isMimeTypeOk;
                    } */
                },
            }
        });
    }
}
export function MaxFileSize(maxFileSizeInBytes: number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        return registerDecorator({
            name: 'isFile',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: UploadFileType | Buffer, args: ValidationArguments) {
                    if (!value) {
                        return false;
                    }

                    const input = value as any;
                    const actualSizeOfUploadedFile = input?.size || Buffer.byteLength(input);
                    return actualSizeOfUploadedFile <= maxFileSizeInBytes;

                    /* if ('mimetype' in value && 'buffer' in value && 'size' in value) {
                        let isMaxOk = value?.size <= expectedSizeInBytes;
                        return isMaxOk;
                    } else if (value instanceof Buffer) {
                        const size = Buffer.byteLength(value);
                        const isMaxOk = size <= expectedSizeInBytes;
                        return isMaxOk;
                    } */

                    // fileTypeFromBuffer(value).then(result => console.log(result))
                    //     .catch(reason => console.log(reason));
                    // throw new Error('Not Implemented');
                },
            }
        });
    }
}



export function MinWordLength(length: number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        return registerDecorator({
            name: 'minWordLength',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: string, args: ValidationArguments) {
                    //TODO implement - link -> https://github.com/typestack/class-validator#custom-validation-decorators
                    // throw new Error('Not Implemented');
                    const numberOfWords = value.split(' ').length;
                    return numberOfWords >= length;
                },
            }
        });
    }
}

interface UniqueOptionsType {
    EntityClass: EntityTarget<unknown>;
    column: string;
}
export function Unique(options: UniqueOptionsType, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        return registerDecorator({
            name: 'minWordLength',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                async validate(value: any, args: ValidationArguments) {
                    //TODO implement - link -> https://github.com/typestack/class-validator#custom-validation-decorators
                    // throw new Error('Not Implemented');
                    if (!options) {
                        throw new InternalServerErrorException(null, 'null passed to @Unique');
                    }
                    const repository = getRepository(options.EntityClass);
                    const condition = { [options.column]: value };
                    const record = await repository.findOne(condition);
                    if (record) { //record already exists
                        return false;
                    } else {
                        return true;
                    }
                },
            }
        });
    }
}


/**
 *
 * checks to see whether the path already exists in the DB
 * checks to see whether image with the same path already exists on the filesystem
 * @param validationOptions
 * @returns
 */
export function DoesImageAlreadyExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        return registerDecorator({
            name: 'minWordLength',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    //TODO implement - link -> https://github.com/typestack/class-validator#custom-validation-decorators
                    throw new InternalServerErrorException(null, 'Not Implemented');

                },
            }
        });
    }
}