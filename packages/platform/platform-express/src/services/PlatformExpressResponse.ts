import {isNumber} from "@tsed/core";
import {PlatformResponse} from "@tsed/platform-http";

export class PlatformExpressResponse extends PlatformResponse<TsED.Response> {
  protected end(data?: string | Buffer) {
    if (isNumber(data)) {
      // TODO remove this when Express 5 will be the default version of Ts.ED
      // @ts-ignore
      this.raw.send(this.statusCode, data);
    } else {
      this.raw.send(data);
    }
  }
}
