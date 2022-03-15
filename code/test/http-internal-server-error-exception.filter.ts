import {ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException, ValidationError} from "@nestjs/common";
import {ValidationException} from "./validation.exception";

@Catch(InternalServerErrorException)
export class HttpInternalServerErrorException implements ExceptionFilter {
    catch(exception: ValidationException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const status = exception.getStatus();

        response.status(status)
            .json({
                statusCode: status,
                message: exception.message,
                stack: exception.stack,
            });
    }
}

