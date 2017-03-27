/**
 * @module mvc
 */ /** */

import {MiddlewareError} from "../decorators/class/middlewareError";
import * as Express from "express";
import {$log} from "ts-log-debug";
import {Exception} from "ts-httpexceptions";
import {IMiddlewareError} from "../interfaces/Middleware";
import {Err} from "../decorators/param/error";
import {Request} from "../decorators/param/request";
import {Response} from "../decorators/param/response";
import {Next} from "../decorators/param/next";

@MiddlewareError()
export class GlobalErrorHandlerMiddleware implements IMiddlewareError {

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

        if (error instanceof Exception || error.status) {
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