
import * as Express from "express";
import {Forbidden} from "ts-httpexceptions";
import {ServerSettingsService} from "../services/server-settings";
import {EndpointInfo} from "../decorators/endpoint-info";
import {Request} from "../decorators/request";
import {Response} from "../decorators/response";
import {Middleware} from "../decorators/middleware";
import {IMiddleware} from "../interfaces/Middleware";
import {Endpoint} from "../controllers/endpoint";
import {Next} from "../decorators/next";

@Middleware()
export default class AuthenticatedMiddleware implements IMiddleware {

    constructor(private serverSettingsService: ServerSettingsService) {

    }

    public use (
        @EndpointInfo() endpoint: Endpoint,
        @Request() request: Express.Request,
        @Response() response: Express.Response,
        @Next() next: Express.NextFunction
    ) {

        const options = endpoint.getMetadata(AuthenticatedMiddleware) || {};

        const callback = (result: boolean) => {
            if (result === false) {
                next(new Forbidden("Forbidden"));
                return;
            }
            next();
        };

        const fn = this.serverSettingsService.authentification;

        /* istanbul ignore else */
        if (fn) {
            const result = fn.call(this, request, response, <Express.NextFunction>callback, options);

            /* istanbul ignore else */
            if (result !== undefined) {
                callback(result);
            }

        } else {
            next();
        }

    }
}