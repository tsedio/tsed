
import * as Express from "express";
import {NotAcceptable} from "ts-httpexceptions";
import {Middleware} from "../../../src/decorators/class/middleware";
import {IMiddleware} from "../../../src/interfaces";
import {Request} from "../../../src/decorators/param/request";
import {Next} from "../../../src/decorators/param/next";

@Middleware()
export default class TestAcceptMimeMiddleware implements IMiddleware {

    private mimes = ['application/json'];

    public use (
        @Request() request: Express.Request,
        @Next() next
    ) {

        this.mimes.forEach((mime) => {

            if (!request.accepts(mime)) {
                throw new NotAcceptable(mime);
            }
        });

        next();
    }
}