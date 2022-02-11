import {PlatformAcceptMimesMiddleware} from "@tsed/common";
import {UseBefore} from "@tsed/platform-middlewares";
import {useDecorators, StoreSet} from "@tsed/core";

export function AcceptMime(...mimes: string[]): Function {
  return useDecorators(StoreSet(PlatformAcceptMimesMiddleware, mimes), UseBefore(PlatformAcceptMimesMiddleware));
}
