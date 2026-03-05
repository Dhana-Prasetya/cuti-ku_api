/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import loggerServices from "@ioc:App/Services/LoggerContract";
import HttpExceptionHandler from "@ioc:Adonis/Core/HttpExceptionHandler";
import ErrorMapper from "App/helper/ErrorMapper";
import standarizedResponse from "App/helper/standarizedResponse";

export default class ExceptionHandler extends HttpExceptionHandler {
    public async handle(error, ctx) {
        const { response } = ctx;

        if (error?.code === "E_VALIDATION_FAILURE") {
            const validationError = error as {
                status?: number;
                messages?: any;
            };
            const validationMessages =
                validationError.messages?.errors ?? validationError.messages;
            const status = validationError.status ?? 422;

            loggerServices.warn("", "Validation error");

            return response
                .status(status)
                .send(
                    standarizedResponse(
                        validationMessages,
                        status,
                        "Validation failed",
                    ),
                );
        }

        if (error instanceof ErrorMapper) {
            loggerServices.warn("", error.message);

            return ctx.response
                .status(error.status)
                .send(standarizedResponse(null, error.status, error.message));
        } else {
            loggerServices.error("", error.message);

            return ctx.response
                .status(500)
                .send(standarizedResponse(null, 500, "Internal server error"));
        }

        // return super.handle(error, ctx);
    }
}
