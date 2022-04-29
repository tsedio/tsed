import {decoratorTypeOf, DecoratorTypes, isPromise, Metadata, prototypeOf, Store, UnsupportedDecoratorType} from "@tsed/core";
import {DI_PARAM_OPTIONS} from "../constants/constants";
import {InvokeOptions} from "../interfaces/InvokeOptions";
import {TokenProvider} from "../interfaces/TokenProvider";
import {InjectorService} from "../services/InjectorService";
import {getContext} from "../utils/runInContext";

export type InjectPropertyResolver = (
  injector: InjectorService,
  locals: Map<TokenProvider, any>,
  options: Partial<InvokeOptions>
) => () => any;

export function injectProperty(target: any, propertyKey: string, resolver: InjectPropertyResolver) {
  Object.defineProperty(prototypeOf(target), propertyKey, {
    enumerable: false,
    configurable: true,
    get() {
      const key = `$$getter_${propertyKey}`;

      if (!this[key]) {
        const fn = resolver(this.$$injector, this.$$locals, this.$$invokeOptions);
        Object.defineProperty(this, key, {
          configurable: true,
          enumerable: false,
          get() {
            return fn;
          }
        });
      }

      return this[key]();
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
        injectProperty(target, propertyKey, (injector, locals, invokeOptions) => {
          const useType = symbol || Metadata.getType(target, propertyKey);

          let bean: any;

          if (!bean) {
            const options = Store.from(target, propertyKey).get(DI_PARAM_OPTIONS);
            locals.set(DI_PARAM_OPTIONS, {...options});

            bean = injector.invoke(useType, locals, invokeOptions);

            locals.delete(DI_PARAM_OPTIONS);

            if (isPromise(bean)) {
              bean.then((result: any) => {
                bean = result;
              });
            }
          }

          return () => onGet(bean);
        });
        break;

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
    injectProperty(target, propertyKey, () => () => getContext());
  };
}
