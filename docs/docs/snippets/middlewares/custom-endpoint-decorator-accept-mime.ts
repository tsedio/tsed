import {PlatformAcceptMimesMiddleware} from "@tsed/common";
import {StoreSet, useDecorators} from "@tsed/core";
import {UseBefore} from "@tsed/platform-middlewares";

export function AcceptMime(...mimes: string[]): Function {
  return useDecorators(StoreSet(PlatformAcceptMimesMiddleware, mimes), UseBefore(PlatformAcceptMimesMiddleware));
}
