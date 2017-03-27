import * as Express from "express";
import {NotAcceptable} from "ts-httpexceptions";
import {IMiddleware, Middleware, Next, Request} from "../../../../src";

@Middleware()
export default class TestAcceptMimeMiddleware implements IMiddleware {

    private mimes = ["application/json"];

    public use(@Request() request: Express.Request,
               @Next() next) {

        this.mimes.forEach((mime) => {

            if (!request.accepts(mime)) {
                throw new NotAcceptable(mime);
            }
        });

        next();
    }
}