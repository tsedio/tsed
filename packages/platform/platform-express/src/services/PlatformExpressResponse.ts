import {isArray, isNumber} from "@tsed/core";
import {PlatformResponse} from "@tsed/platform-http";

export class PlatformExpressResponse extends PlatformResponse<TsED.Response> {
  cookie(name: string, value: string | null, opts?: TsED.SetCookieOpts) {
    super.cookie(name, value, opts);

    const cookie = this.get("set-cookie");

    if (cookie && !isArray(value)) {
      this.setHeader("set-cookie", [].concat(cookie));
    }

    return this;
  }

  protected end(data?: number | string | Buffer) {
    if (isNumber(data)) {
      this.raw.send(String(data));
    } else {
      this.raw.send(data);
    }
  }
}
