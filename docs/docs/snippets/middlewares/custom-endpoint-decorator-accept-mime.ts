import {AcceptMimesMiddleware, UseBefore} from "@tsed/common";
import {applyDecorators, StoreSet} from "@tsed/core";

export function AcceptMime(...mimes: string[]): Function {
  return applyDecorators(
    StoreSet(AcceptMimesMiddleware, mimes),
    UseBefore(AcceptMimesMiddleware)
  );
}
