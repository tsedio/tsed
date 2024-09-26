import type {PlatformContext} from "@tsed/common";
import {PlatformHandler} from "@tsed/common";
import type {AnyPromiseResult} from "@tsed/core";
import {isFunction, isStream} from "@tsed/core";
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
