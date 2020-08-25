import {UseBefore} from "@tsed/common/src";
import {StoreSet, useDecorators} from "@tsed/core";
import {AcceptMimesMiddleware} from "../middlewares/AcceptMimesMiddleware";

export function Accept(...mimes: string []) {
  return useDecorators(
    StoreSet(AcceptMimesMiddleware, {
      mimes
    }),
    UseBefore(AcceptMimesMiddleware)
  );
}
