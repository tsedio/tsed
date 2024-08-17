import {ParamOptions, PlatformParams, PlatformTest} from "@tsed/common";
import {JsonParameterStore} from "@tsed/schema";
import {createFakeHandlerContext} from "./createFakeHandlerContext.js";
import {DecoratorTypes} from "@tsed/core";

export interface TestPlatformParamsOptions extends ParamOptions {
  required?: boolean;
}

export function invokePlatformParams<T extends PlatformParams>(): T {
  return PlatformTest.invoke<T>(PlatformParams) as unknown as T;
}

export async function buildPlatformParams({expression, required, ...options}: TestPlatformParamsOptions) {
  const platformParams = await invokePlatformParams();

  class Test {
    test() {}
  }

  const param = new JsonParameterStore({
    target: Test,
    propertyKey: "test",
    index: 0,
    decoratorType: DecoratorTypes.PARAM,
    ...options
  });

  const h = createFakeHandlerContext();

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
