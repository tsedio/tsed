/// <reference types="express-serve-static-core" />

import * as core from "express-serve-static-core";

declare namespace Express {

    interface NextFunction extends Function {

    }

    interface Request {
        $tryAuth: (request: core.Request, response: core.Response, next: Express.NextFunction) => boolean;
    }
}


