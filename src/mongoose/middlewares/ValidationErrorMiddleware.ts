import {Err, MiddlewareError, Next} from "@tsed/common";
import {getClass, nameOf} from "@tsed/core";
import * as Express from "express";
import {BadRequest} from "ts-httpexceptions";

@MiddlewareError()
export class ValidationErrorMiddleware {

    /**
     *
     * @param error
     * @param req
     * @param {e.Response} res
     * @param {e.NextFunction} next
     */
    use(@Err() error: any, @Next() next: Express.NextFunction) {

        if (error && nameOf(getClass(error)) === "MongooseError") {
            const err = new BadRequest(error.message);
            err.stack = error.stack;
            throw err;
        }

        next(error);
    }
}