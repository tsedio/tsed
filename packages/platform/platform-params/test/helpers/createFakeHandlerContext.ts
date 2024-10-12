import {AnyToPromiseWithCtx} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";

export function createFakeHandlerContext() {
  const $ctx = PlatformTest.createRequestContext();

  return new AnyToPromiseWithCtx($ctx);
}
