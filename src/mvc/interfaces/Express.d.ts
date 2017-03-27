import {EndpointMetadata} from "../class/EndpointMetadata";

declare global {

    namespace Express {

        interface NextFunction extends Function {

        }
        export interface Response { }
        export interface Application { }

        interface Request {
            tagId?: string;
            endpointCalled?: boolean;
            $tryAuth: (request: Express.Request, response: Express.Response, next: Express.NextFunction, authorization?) => boolean;
            /**
             *
             */
            getEndpoint(): EndpointMetadata;
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


