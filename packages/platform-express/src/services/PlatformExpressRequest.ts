import {PlatformContext, PlatformRequest} from "@tsed/common";
import type * as Express from "express";

declare module "express" {
  export interface Request {
    id: string;
    $ctx: PlatformContext;
  }
}

declare global {
  namespace TsED {
    export interface Request extends Express.Request {
      id: string;
      $ctx: PlatformContext;
    }
  }
}

/**
 * @platform
 * @express
 */
export class PlatformExpressRequest extends PlatformRequest<Express.Request> {}
