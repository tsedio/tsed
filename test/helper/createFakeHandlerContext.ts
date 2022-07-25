import {AnyToPromiseWithCtx, PlatformTest} from "@tsed/common";

export function createFakeHandlerContext() {
  const $ctx = PlatformTest.createRequestContext();

  return new AnyToPromiseWithCtx($ctx);
}
