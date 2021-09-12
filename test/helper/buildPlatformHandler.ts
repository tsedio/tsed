import {ParamMetadata, ParamOptions, PlatformHandler, PlatformTest} from "@tsed/common";
import {Type} from "@tsed/core";
import {createFakeHandlerContext} from "./createFakeHandlerContext";

export interface TestPlatformHandlerOptions extends Partial<ParamOptions> {
  type: string;
  token: Type<PlatformHandler>;
  sandbox: any;
  required?: boolean;
}

export function invokePlatformHandler<T extends PlatformHandler>(token: any): T {
  PlatformTest.injector.getProvider(PlatformHandler)!.useClass = token;

  return PlatformTest.invoke<T>(PlatformHandler) as T;
}

export async function buildPlatformHandler({type, token, sandbox, expression, required}: TestPlatformHandlerOptions) {
  const platformHandler = await invokePlatformHandler(token);

  class Test {
    test() {}
  }

  const param = new ParamMetadata({
    target: Test,
    propertyKey: "test",
    index: 0,
    paramType: type,
    dataPath: '$ctx'
  });

  const h = createFakeHandlerContext(param, sandbox);

  if (expression) {
    param.expression = expression;
  }
  if (required) {
    param.required = required;
  }

  return {
    platformHandler,
    h,
    param,
    response: h.response,
    request: h.request,
    ctx: h.$ctx,
    $ctx: h.$ctx
  };
}
