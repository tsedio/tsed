import {classOf, type Type} from "@tsed/core";

import {bindIntercept} from "../decorators/intercept.js";
import {ProviderBuilder} from "../domain/ProviderBuilder.js";
import type {InterceptorMethods} from "../interfaces/InterceptorMethods.js";
import type {TokenProvider} from "../interfaces/TokenProvider.js";

declare global {
  namespace TsED {
    interface ClassProviderBuilder<Token extends Type> {
      intercept(
        property: keyof InstanceType<Token>,
        interceptor: TokenProvider<InterceptorMethods>,
        options: Record<string, unknown>
      ): this;
    }
  }
}

ProviderBuilder.add("intercept", function intercept(propertyKey: string | number | symbol, interceptorToken, options) {
  bindIntercept(classOf(this.inspect().useClass), propertyKey as string | symbol, interceptorToken, options);

  return this;
});
