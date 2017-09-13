import * as Express from "express";
import {IMiddleware, Middleware} from "../../../../src";

@Middleware()
export class TestMiddleware implements IMiddleware {

    constructor() {

    }

    use(request: Express.Request, response: Express.Response): Promise<any> {

        request.params.test = "testMiddleware";

        return Promise.resolve();
    }
}

@Middleware()
export class Test2Middleware implements IMiddleware {

    constructor() {

    }

    use(request: Express.Request, response: Express.Response, next: Express.NextFunction): void {
        request.params.test = "test2Middleware";
        next();
    }
}