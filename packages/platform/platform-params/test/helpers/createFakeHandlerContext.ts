import {AnyToPromiseWithCtx, PlatformTest} from "@tsed/platform-http";

export function createFakeHandlerContext() {
  const $ctx = PlatformTest.createRequestContext();

  return new AnyToPromiseWithCtx($ctx);
}
