import * as Express from "express";
import {Forbidden} from "ts-httpexceptions";
import {IMiddleware} from "../";
import {EndpointInfo} from "../../filters/decorators/endpointInfo";
import {Next} from "../../filters/decorators/next";
import {Request} from "../../filters/decorators/request";
import {EndpointMetadata} from "../class/EndpointMetadata";
import {Middleware} from "../decorators/class/middleware";

/**
 * This middleware manage the authentication.
 * @private
 * @middleware
 */
@Middleware()
export class AuthenticatedMiddleware implements IMiddleware {
    public use(@EndpointInfo() endpoint: EndpointMetadata,
               @Request() request: Express.Request,
               @Next() next: Express.NextFunction) {

        // const options = endpoint.get(AuthenticatedMiddleware) || {};
        const isAuthenticated = (request as any).isAuthenticated;

        if (typeof isAuthenticated === "function") {
            if (!isAuthenticated()) {
                next(new Forbidden("Forbidden"));
                return;
            }
        }

        next();

    }
}