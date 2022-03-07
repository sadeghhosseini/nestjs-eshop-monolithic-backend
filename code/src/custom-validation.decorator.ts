import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
// import {fileTypeFromBuffer} from 'file-type';
import { Connection, Entity, EntityTarget, getConnection } from "typeorm";

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
export function IsFile(options: IsFileOptions, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        return registerDecorator({
            name: 'isFile',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    //TODO implement - link -> https://github.com/typestack/class-validator#custom-validation-decorators
                    
                    if (value?.mimetype && (options?.mime ?? []).includes(value?.mimetype)) {
                        return true;
                    }
                    
                    // fileTypeFromBuffer(value).then(result => console.log(result))
                    //     .catch(reason => console.log(reason));
                    // throw new Error('Not Implemented');
                    return false;
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
                validate(value: any, args: ValidationArguments) {
                    //TODO implement - link -> https://github.com/typestack/class-validator#custom-validation-decorators
                    throw new Error('Not Implemented');
                },
            }
        });
    }
}

export function Unique(RefrencedTableRepositoryClass, validationOptions?: ValidationOptions) {
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
                    throw new Error('Not Implemented');
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
                    throw new Error('Not Implemented');
                },
            }
        });
    }
}