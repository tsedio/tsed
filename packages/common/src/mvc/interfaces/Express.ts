import {Context} from "../class/Context";
import {RequestLogger} from "../class/RequestLogger";

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
      ctx: Context;
      log: RequestLogger;
    }
  }
}
