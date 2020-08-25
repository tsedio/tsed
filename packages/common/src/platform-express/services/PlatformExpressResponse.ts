import {OverrideProvider} from "@tsed/di";
import {PlatformResponse} from "../../platform/services/PlatformResponse";

@OverrideProvider(PlatformResponse)
export class PlatformExpressResponse extends PlatformResponse {
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
