import {Endpoint} from "../controllers/endpoint";

declare global {

    namespace Express {

        interface NextFunction extends Function {

        }
        export interface Response { }
        export interface Application { }

        interface Request {
            tagId?: string;
            $tryAuth: (request: Express.Request, response: Express.Response, next: Express.NextFunction, authorization?) => boolean;
            /**
             *
             */
            getEndpoint(): Endpoint;
            /**
             *
             */
            getStoredData(): any;
            /**
             *
             * @param obj
             */
            storeData(obj: any): Express.Request;
        }
    }
}


