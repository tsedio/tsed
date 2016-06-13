
declare module Express {

    interface NextFunction extends Function {

    }

    interface Request {
        $tryAuth: (request: Express.Request, response: Express.Response, next: Express.NextFunction) => boolean;
    }
}