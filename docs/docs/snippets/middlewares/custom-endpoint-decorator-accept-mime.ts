import {AcceptMimesMiddleware} from "@tsed/common";
import {UseBefore} from "@tsed/platform-middlewares";
import {useDecorators, StoreSet} from "@tsed/core";

export function AcceptMime(...mimes: string[]): Function {
  return useDecorators(
    StoreSet(AcceptMimesMiddleware, mimes),
    UseBefore(AcceptMimesMiddleware)
  );
}
