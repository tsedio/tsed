import {iHandlerMiddleware} from "./handler-middleware";

export interface iMiddlewares{
    handlers:iHandlerMiddleware[],
    path?:string,
    defaultMethod?:string
}