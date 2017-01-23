
import {Express} from '@types/express';

export interface IMiddleware {
    use?(request: Express.Request, response: Express.Response, next?: (err?: any) => any): any;
    use?(error: any, request: Express.Request, response: Express.Response, next?: (err?: any) => any): any;
}