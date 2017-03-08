
import {IMiddleware, Middleware, Request, EndpointInfo, Endpoint} from "../";
import * as Express from "express";
import {NotAcceptable} from "ts-httpexceptions";

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