
import * as Express from "express";
import {NotAcceptable} from "ts-httpexceptions";
import {Middleware} from "../../../src/decorators/middleware";
import {IMiddleware} from "../../../src/interfaces/Middleware";
import {Request} from "../../../src/decorators/request";
import {Next} from "../../../src/decorators/next";

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