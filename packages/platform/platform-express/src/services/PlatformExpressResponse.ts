import {PlatformResponse} from "@tsed/common";
import type Express from "express";

declare global {
  namespace TsED {
    export interface Response extends Express.Response {}
  }
}

/**
 * @platform
 * @express
 */
export class PlatformExpressResponse extends PlatformResponse<Express.Response> {}
