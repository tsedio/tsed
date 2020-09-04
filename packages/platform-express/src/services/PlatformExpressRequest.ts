import {PlatformContext, PlatformRequest} from "@tsed/common";
import type * as Express from "express";

declare global {
  namespace Express {
    export interface Request {
      id: string;
      $ctx: PlatformContext;
    }
  }
  namespace TsED {
    export interface Request extends Express.Request {}
  }
}

/**
 * @platform
 * @express
 */
export class PlatformExpressRequest extends PlatformRequest<Express.Request> {}
