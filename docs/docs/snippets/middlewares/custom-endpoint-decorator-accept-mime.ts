import {PlatformAcceptMimesMiddleware, UseBefore} from "@tsed/common";
import {useDecorators, StoreSet} from "@tsed/core";

export function AcceptMime(...mimes: string[]): Function {
  return useDecorators(
    StoreSet(PlatformAcceptMimesMiddleware, mimes),
    UseBefore(PlatformAcceptMimesMiddleware)
  );
}
