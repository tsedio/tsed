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

ProviderBuilder.add("intercept", (providerBuilder) => {
  return (propertyKey: string, interceptorToken, options) => {
    bindIntercept(classOf(providerBuilder.inspect().useClass), propertyKey as string, interceptorToken, options);

    return providerBuilder;
  };
});
