import {ParamMetadata, ParamOptions, ParseExpressionPipe, PlatformParams, PlatformTest} from "@tsed/common";
import {createFakeHandlerContext} from "./createFakeHandlerContext";

export interface TestPlatformParamsOptions extends ParamOptions {
  sandbox: any;
  required?: boolean;
}

export function invokePlatformParams<T extends PlatformParams>(): T {
  return PlatformTest.invoke<T>(PlatformParams) as T;
}

export async function buildPlatformParams({sandbox, expression, required, ...options}: TestPlatformParamsOptions) {
  const platformParams = await invokePlatformParams();

  class Test {
    test() {
    }
  }

  const param = new ParamMetadata({
    target: Test,
    propertyKey: "test",
    index: 0,
    ...options
  });

  const h = createFakeHandlerContext(param, sandbox);

  if (required) {
    param.required = required;
  }

  return {
    platformParams,
    h,
    param,
    response: h.$ctx.response,
    request: h.$ctx.request,
    ctx: h.$ctx,
    $ctx: h.$ctx
  };
}
