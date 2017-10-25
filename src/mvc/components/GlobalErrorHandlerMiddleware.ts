/**
 * @module common/mvc
 */
/** */

import * as Express from "express";
import {Exception} from "ts-httpexceptions";
import {$log} from "ts-log-debug";
import {MiddlewareError} from "../decorators/class/middlewareError";
import {Err} from "../../filters/decorators/error";
import {Next} from "../../filters/decorators/next";
import {Request} from "../../filters/decorators/request";
import {Response} from "../../filters/decorators/response";
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
            $log.error("" + error);
            response.status(error.status).send(toHTML(error.message));
            return;
        }

        if (typeof error === "string") {
            response.status(404).send(toHTML(error));
            return;
        }

        $log.error(error);
        response.status(error.status || 500).send("Internal Error");

        return;
    }
}