import {RequestContext} from "../domain/RequestContext";
import {RequestLogger} from "../domain/RequestLogger";

declare global {
  namespace Express {
    export interface NextFunction extends Function {
      isCalled: boolean;
    }

    export interface Response {
      headersSent: boolean;
    }

    export interface Application {}

    export interface Request {
      id: string;
      ctx: RequestContext;
      /**
       * @deprecated
       */
      log: RequestLogger;
    }
  }
}
