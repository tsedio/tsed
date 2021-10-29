import {UseBefore} from "@tsed/platform-middlewares";
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
