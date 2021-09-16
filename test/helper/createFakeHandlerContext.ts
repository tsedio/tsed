import {AnyToPromiseWithCtx, ParamMetadata} from "@tsed/common";
import {createFakePlatformContext} from "./createFakePlatformContext";

export function createFakeHandlerContext(param: ParamMetadata, sandbox: any) {
  const $ctx = createFakePlatformContext(sandbox);

  return new AnyToPromiseWithCtx({
    $ctx
  });
}
