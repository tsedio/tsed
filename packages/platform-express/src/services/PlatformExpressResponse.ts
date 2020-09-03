import {PlatformResponse} from "@tsed/common";
import type * as Express from "express";

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
    return new Promise((resolve, reject) => {
      this.raw.render(path, options, (err: any, html) => {
        err ? reject(err) : resolve(html);
      });
    });
  }
}
