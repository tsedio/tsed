import {PlatformResponse} from "@tsed/common";
import type * as Express from "express";

declare global {
  namespace Express {
    export interface Response {}
  }
  namespace TsED {
    export interface Response extends Express.Response {}
  }
}

/**
 * @platform
 * @express
 */
export class PlatformExpressResponse extends PlatformResponse<Express.Response> {}
