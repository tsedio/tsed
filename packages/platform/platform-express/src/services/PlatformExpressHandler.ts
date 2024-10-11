import {AnyPromiseResult, isFunction, isStream} from "@tsed/core";
import {PlatformContext, PlatformHandler} from "@tsed/platform-http";
import {promisify} from "util";

export class PlatformExpressHandler extends PlatformHandler {
  onResponse(response: AnyPromiseResult, $ctx: PlatformContext): any {
    super.onResponse(response, $ctx);

    // call returned middleware
    if (isFunction($ctx.data) && !isStream($ctx.data)) {
      return promisify($ctx.data)($ctx.getRequest(), $ctx.getResponse());
    }
  }
}
