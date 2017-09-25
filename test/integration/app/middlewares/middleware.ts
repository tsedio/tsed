import * as Express from "express";
import {IMiddleware, Middleware} from "../../../../src";
import {ResponseData} from "../../../../src/mvc/decorators/param/responseData";

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


@Middleware()
export class Middleware1 implements IMiddleware {
    async use(@ResponseData() data: any) {

        console.log("M1 Incoming Data: ", data);
        console.log("M1 returning", data + 1);
        return data + 1;
    }
}

@Middleware()
export class Middleware2 implements IMiddleware {
    async use(@ResponseData() data: any) {

        console.log("M2 Incoming Data: ", data);
        console.log("M3 returning", data + 2);
        return Promise.resolve(data + 2);
    }
}

@Middleware()
export class Middleware3 implements IMiddleware {
    async use(@ResponseData() data: any) {

        console.log("M3 Incoming Data: ", data);
        console.log("M3 returning", data + 3);
        return data + 3;
    }
}