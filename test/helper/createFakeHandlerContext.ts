import {HandlerContext, ParamMetadata, PlatformTest} from "@tsed/common/src";
import {createFakePlatformContext} from "./createFakePlatformContext";

export function createFakeHandlerContext(param: ParamMetadata, sandbox: any) {
  const ctx = createFakePlatformContext(sandbox);
  const next: any = sandbox.stub();

  return new HandlerContext({
    injector: PlatformTest.injector,
    request: ctx.request.raw,
    response: ctx.response.raw,
    next,
    args: [],
    metadata: {} as any
  });
}
