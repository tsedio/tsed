import {EndpointMetadata} from "../class/EndpointMetadata";

declare global {

    namespace Express {

        interface NextFunction extends Function {

        }

        export interface Response {
        }

        export interface Application {
        }

        export interface Request {
            id: string;
            tagId: string;
            tsedReqStart: Date;
            $tryAuth: (request: Express.Request, response: Express.Response, next: Express.NextFunction, authorization?: any) => boolean;

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

            log: RequestLogger;
        }

        export interface RequestLogger {
            debug(scope?: any): void;

            info(scope?: any): void;

            trace(scope?: any): void;

            warn(scope?: any): void;

            error(scope?: any): void;
        }
    }
}


