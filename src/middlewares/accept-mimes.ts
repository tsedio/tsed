
import * as Express from "express";
import {NotAcceptable} from "ts-httpexceptions";
import {Middleware} from "../decorators/class/middleware";
import {IMiddleware} from "../interfaces/interfaces";
import {EndpointInfo} from "../decorators/param/endpoint-info";
import {Endpoint} from "../controllers/endpoint";
import {Request} from "../decorators/param/request";

@Middleware()
export default class AcceptMimesMiddleware implements IMiddleware {

    public use (
        @EndpointInfo() endpoint: Endpoint,
        @Request() request: Express.Request
    ) {

        const mimes = endpoint.getMetadata(AcceptMimesMiddleware) || [];

        mimes.forEach((mime) => {
            if (!request.accepts(mime)) {
                throw new NotAcceptable(mime);
            }
        });

    }
}