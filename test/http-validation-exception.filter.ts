import { ArgumentsHost, Catch, ExceptionFilter, HttpException, ValidationError } from "@nestjs/common";
import { ValidationException } from "./validation.exception";

@Catch(ValidationException)
export class HttpValidationExceptionFilter implements ExceptionFilter {
    catch(exception: ValidationException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const status = exception.getStatus();
        const errorCodes = exception.getValidationErrors()
        /* .map(error => {
            return Object.values(error.contexts ?? {}).map((val: { errorCode: string }) => {
                return `${error.property}.${val.errorCode}`;
            });
        }) */
        const ecs = getErrorCodes(errorCodes);
        response.status(status)
            .json({
                statusCode: status,
                // errorCodes: errorCodes.flat(),
                errorCodes: ecs,
            });
    }
}

const getErrorCodes = (errors: ValidationError[]) => {
    let result = [];
    for (let i = 0; i < errors.length; ++i) {
        const error = errors[i];
        const ecs = Object.values(error.contexts ?? {}).map((val: { errorCode: string }) => {
            return `${error.property}.${val.errorCode}`;
        }) ?? [];
        result = [
            ...result,
            ...ecs,
        ];

        if (error.children.length > 0) {
            const ecs = getErrorCodes(error.children);
            result = [
                ...result,
                ...ecs,
            ];
        }
    }

    return result;
}