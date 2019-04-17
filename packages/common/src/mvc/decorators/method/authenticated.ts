import {classOf, DecoratorParameters, descriptorOf, getDecoratorType, methodsOf, prototypeOf, Store} from "@tsed/core";
import {AuthenticatedMiddleware} from "../../components/AuthenticatedMiddleware";
import {UseBefore} from "./useBefore";

function decorate(options: any) {
  return Store.decorate((store: Store) => {
    store.set(AuthenticatedMiddleware, options).merge("responses", {"403": {description: "Forbidden"}});

    return UseBefore(AuthenticatedMiddleware);
  });
}

/**
 * Set authentication strategy on your endpoint.
 *
 * ```typescript
 * @ControllerProvider('/mypath')
 * class MyCtrl {
 *
 *   @Get('/')
 *   @Authenticated({role: 'admin'})
 *   public getResource(){}
 * }
 * ```
 *
 * @param options
 * @returns {Function}
 * @decorator
 */
export function Authenticated(options?: any): Function {
  return <T>(...parameters: DecoratorParameters): TypedPropertyDescriptor<T> | void => {
    switch (getDecoratorType(parameters, true)) {
      case "method":
        return decorate(options)(...parameters);

      case "class":
        const [klass] = parameters;

        methodsOf(klass).forEach(({target, propertyKey}) => {
          if (target !== classOf(klass)) {
            prototypeOf(klass)[propertyKey] = function anonymous(...args: any) {
              return prototypeOf(target)[propertyKey].apply(this, args);
            };
          }

          decorate(options)(prototypeOf(klass), propertyKey, descriptorOf(klass, propertyKey));
        });
        break;
    }
  };
}
