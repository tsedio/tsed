import {getContext, injectProperty} from "@tsed/common";
import {DecoratorParameters, decoratorTypeOf, DecoratorTypes} from "@tsed/core";
import {Inject} from "@tsed/di";
import {APOLLO_CONTEXT} from "../constants/constants";

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
        injectProperty(args[0], args[1] as string, {
          resolver() {
            return () => getContext()?.get(APOLLO_CONTEXT);
          }
        });
    }
  };
}
