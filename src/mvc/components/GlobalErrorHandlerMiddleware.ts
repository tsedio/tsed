/**
 * @module common/mvc
 */
/** */

import * as Express from "express";
import {Exception} from "ts-httpexceptions";
import {Err} from "../../filters/decorators/error";
import {Request} from "../../filters/decorators/request";
import {Response} from "../../filters/decorators/response";
import {MiddlewareError} from "../decorators/class/middlewareError";
import {IMiddlewareError} from "../interfaces";

/**
 * @middleware
 */
@MiddlewareError()
export class GlobalErrorHandlerMiddleware implements IMiddlewareError {

    use(@Err() error: any,
        @Request() request: Express.Request,
        @Response() response: Express.Response): any {

        const toHTML = (message = "") => message.replace(/\n/gi, "<br />");

        if (error instanceof Exception || error.status) {
            request.log.error({
                error: {
                    message: error.message,
                    stack: error.stack,
                    status: error.status
                }
            });
            response.status(error.status).send(toHTML(error.message));
            return;
        }

        if (typeof error === "string") {
            response.status(404).send(toHTML(error));
            return;
        }

        request.log.error({
            error: {
                status: 500,
                message: error.message,
                stack: error.stack
            }
        });
        response.status(error.status || 500).send("Internal Error");

        return;
    }
}