import {PlatformContext, RequestLogger} from "../../platform";

namespace Express {
  export interface NextFunction extends Function {}

  export interface Response {
    headersSent: boolean;
  }

  export interface Application {}

  export interface Request {
    id: string;
    ctx: PlatformContext;
    /**
     * @deprecated
     */
    log: RequestLogger;
  }
}
