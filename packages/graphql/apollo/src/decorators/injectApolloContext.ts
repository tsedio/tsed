import {DecoratorParameters, decoratorTypeOf, DecoratorTypes} from "@tsed/core";
import {Inject, InjectContext} from "@tsed/di";

import {APOLLO_CONTEXT} from "../constants/constants.js";

/**
 * Inject the Apollo context in the decorated property.
 * @decorator
 */
export function InjectApolloContext(): any {
  return (...args: DecoratorParameters) => {
    switch (decoratorTypeOf(args)) {
      case DecoratorTypes.PARAM_CTOR:
        Inject(APOLLO_CONTEXT)(...args);
        break;

      case DecoratorTypes.PROP:
        return InjectContext(($ctx) => $ctx.get(APOLLO_CONTEXT))(args[0], args[1]);
    }
  };
}
