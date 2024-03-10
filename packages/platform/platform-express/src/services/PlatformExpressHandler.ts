import {PlatformContext, PlatformHandler} from "@tsed/common";
import {AnyPromiseResult, catchAsyncError, isFunction, isStream} from "@tsed/core";
import {PlatformParamsCallback} from "@tsed/platform-params";
import {promisify} from "util";

export class PlatformExpressHandler extends PlatformHandler {
  async onRequest(handler: PlatformParamsCallback, $ctx: PlatformContext): Promise<any> {
    try {
      await super.onRequest(handler, $ctx);
    } catch (error) {
      $ctx.error = error;
    }
  }

  onResponse(response: AnyPromiseResult, $ctx: PlatformContext): any {
    super.onResponse(response, $ctx);

    // call returned middleware
    if (isFunction($ctx.data) && !isStream($ctx.data)) {
      return promisify($ctx.data)($ctx.getRequest(), $ctx.getResponse());
    }
  }
}
