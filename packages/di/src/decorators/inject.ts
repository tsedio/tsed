import {decoratorTypeOf, DecoratorTypes, isPromise, Metadata, Store, UnsupportedDecoratorType} from "@tsed/core";
import {DI_PARAM_OPTIONS, INJECTABLE_PROP} from "../constants/constants";
import type {InjectablePropertyOptions} from "../interfaces/InjectableProperties";
import {getContext} from "../utils/runInContext";

export function injectProperty(target: any, propertyKey: string, options: Partial<InjectablePropertyOptions>) {
  Store.from(target).merge(INJECTABLE_PROP, {
    [propertyKey]: {
      bindingType: DecoratorTypes.PROP,
      propertyKey,
      ...options
    }
  });
}

/**
 * Inject a provider to another provider.
 *
 * Use this decorator to inject a custom provider on constructor parameter or property.
 *
 * ```typescript
 * @Injectable()
 * export class MyService {
 *   @Inject(CONNECTION)
 *   connection: CONNECTION;
 * }
 * ```
 *
 * @param symbol
 * @param onGet Use the given name method to inject
 * @returns {Function}
 * @decorator
 */
export function Inject(symbol?: any, onGet = (bean: any) => bean): Function {
  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function> | number): any | void => {
    const bindingType = decoratorTypeOf([target, propertyKey, descriptor]);

    switch (bindingType) {
      case DecoratorTypes.PARAM:
      case DecoratorTypes.PARAM_CTOR:
        if (symbol) {
          const paramTypes = Metadata.getParamTypes(target, propertyKey);

          paramTypes[descriptor as number] = symbol;
          Metadata.setParamTypes(target, propertyKey, paramTypes);
        }
        break;

      case DecoratorTypes.PROP:
        injectProperty(target, propertyKey, {
          resolver(injector, locals, {options, ...invokeOptions}) {
            locals.set(DI_PARAM_OPTIONS, {...options});

            let bean: any;

            if (!bean) {
              const useType = symbol || Metadata.getType(target, propertyKey);
              bean = injector.invoke(useType, locals, invokeOptions);
              locals.delete(DI_PARAM_OPTIONS);
            }

            if (isPromise(bean)) {
              bean.then((result: any) => {
                bean = result;
              });
            }

            return () => onGet(bean);
          }
        });
        break;

      case DecoratorTypes.METHOD:
        Store.from(target).merge(INJECTABLE_PROP, {
          [propertyKey]: {
            bindingType,
            propertyKey
          }
        });

        return descriptor;

      default:
        throw new UnsupportedDecoratorType(Inject, [target, propertyKey, descriptor]);
    }
  };
}

/**
 * Inject a context like PlatformContext or any BaseContext.
 *
 * ```typescript
 * @Injectable()
 * export class MyService {
 *   @InjectContext()
 *   ctx?: Context;
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 */
export function InjectContext(): PropertyDecorator {
  return (target: any, propertyKey: string): any | void => {
    injectProperty(target, propertyKey, {
      resolver() {
        return () => getContext();
      }
    });
  };
}
