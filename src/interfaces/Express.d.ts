import * as Express from 'express';

declare namespace Express {

    interface NextFunction extends Function {

    }

    interface Request {
        $tryAuth: (request: Express.Request, response: Express.Response, next: Express.NextFunction, authorization?) => boolean;
    }
}


