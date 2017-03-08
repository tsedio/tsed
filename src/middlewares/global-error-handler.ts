
import {IMiddlewareError} from "../interfaces/Middleware";
import {MiddlewareError} from "../decorators/middleware-error";
import {Err} from "../decorators/error";
import {Response} from "../decorators/response";
import {Next} from "../decorators/next";
import * as Express from "express";
import {$log} from "ts-log-debug";
import {Exception} from "ts-httpexceptions";
import {Request} from "../decorators/request";

@MiddlewareError()
export default class GlobalErrorHandlerMiddleware implements IMiddlewareError {

    use(
        @Err() error: any,
        @Request() request: Express.Request,
        @Response() response: Express.Response,
        @Next() next: Express.NextFunction
    ): any {

        if (response.headersSent) {
            return next(error);
        }

        const toHTML = (message = "") => message.replace(/\n/gi, "<br />");

        if (error instanceof Exception) {
            $log.error("" + error);
            response.status(error.status).send(toHTML(error.message));
            return next();
        }

        if (typeof error === "string") {
            response.status(404).send(toHTML(error));
            return next();
        }

        $log.error("" + error);
        response.status(error.status || 500).send("Internal Error");

        return next();
    }
}