import {UseBefore} from "@tsed/platform-middlewares";
import {useDecorators, StoreSet} from "@tsed/core";
import {AcceptMimesMiddleware} from "./AcceptMimesMiddleware";

export function AcceptMime(...mimes: string[]): Function {
  return useDecorators(
    StoreSet(AcceptMimesMiddleware, mimes),
    UseBefore(AcceptMimesMiddleware)
  );
}
