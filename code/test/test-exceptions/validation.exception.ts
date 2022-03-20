import { HttpException, HttpStatus, ValidationError } from "@nestjs/common";


export class ValidationException extends HttpException {
    constructor(private readonly errors: ValidationError[]) {
        super('ValidationError', HttpStatus.BAD_REQUEST);
    }

    getValidationErrors(): ValidationError[] {
        return this.errors;
    }
}