/**
 * @module common/mvc
 */
/** */
import * as Express from "express";
import {Forbidden} from "ts-httpexceptions";
import {IMiddleware} from "../";
import {ServerSettingsService} from "../../server/services/ServerSettingsService";
import {EndpointMetadata} from "../class/EndpointMetadata";
import {Middleware} from "../decorators/class/middleware";
import {EndpointInfo} from "../decorators/param/endpointInfo";
import {Next} from "../decorators/param/next";
import {Request} from "../decorators/param/request";
import {Response} from "../decorators/param/response";
/**
 * This middleware manage the authentication.
 * @private
 * @middleware
 */
@Middleware()
export class AuthenticatedMiddleware implements IMiddleware {

    constructor(private serverSettingsService: ServerSettingsService) {

    }

    public use(@EndpointInfo() endpoint: EndpointMetadata,
               @Request() request: Express.Request,
               @Response() response: Express.Response,
               @Next() next: Express.NextFunction) {

        const options = endpoint.store.get(AuthenticatedMiddleware) || {};
        let resolved = false;

        const callback = (result: boolean) => {
            if (!resolved) {
                resolved = true;
                if (result === false) {
                    next(new Forbidden("Forbidden"));
                    return;
                }
                next();
            }
        };

        const fn = this.serverSettingsService.authentification;
        /* istanbul ignore else */
        if (fn) {
            try {
                const result = fn(request, response, <Express.NextFunction>callback, options);
                /* istanbul ignore else */
                if (result !== undefined) {
                    callback(result);
                }
            } catch (er) {
                /* istanbul ignore next */
                console.error(er);
                /* istanbul ignore next */
                next(er);
            }


        } else {
            next();
        }

    }
}