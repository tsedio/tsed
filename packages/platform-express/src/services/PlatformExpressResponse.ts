import {PlatformResponse} from "@tsed/common";
import type * as Express from "express";
import {promisify} from "util";

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
export class PlatformExpressResponse extends PlatformResponse<Express.Response> {
  /**
   * Render a view from given data
   * @param path
   * @param options
   */
  async render(path: string, options: any = {}): Promise<string> {
    return promisify(this.raw.render.bind(this.raw))(path, options);
  }
}
