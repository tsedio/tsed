import {catchError, decoratorTypeOf, DecoratorTypes, isPromise, Metadata, Store, type Type} from "@tsed/core";

import {DI_INJECTABLE_PROPS, DI_INVOKE_OPTIONS, DI_USE_OPTIONS} from "../constants/constants.js";
import {InvalidPropertyTokenError} from "../errors/InvalidPropertyTokenError.js";
import {inject} from "../fn/inject.js";
import {injectMany} from "../fn/injectMany.js";
import type {InvokeOptions} from "../interfaces/InvokeOptions.js";
import {TokenProvider} from "../interfaces/TokenProvider.js";
import {getConstructorDependencies, setConstructorDependencies} from "../utils/getConstructorDependencies.js";

function setToken(
  token: TokenProvider,
  {
    target,
    propertyKey,
    parameterIndex
  }: {
    target: any;
    propertyKey: string | symbol | undefined;
    parameterIndex: number;
  }
) {
  const paramTypes = getConstructorDependencies(target, propertyKey);
  const type = paramTypes[parameterIndex];

  paramTypes[parameterIndex] = type === Array ? [token] : token;

  Metadata.setParamTypes(target, propertyKey!, paramTypes);
  setConstructorDependencies(target, paramTypes);
}

function getTokenType(token: TokenProvider | (() => TokenProvider) | undefined, target: any, propertyKey: string | symbol) {
  const useType = token || Metadata.getType(target, propertyKey);

  if (useType === Object) {
    throw new InvalidPropertyTokenError(target, String(propertyKey));
  }

  return useType;
}

export type TransformInjectedProviderCB<T, Klass = any> = (
  instance: T,
  {target, propertyKey}: {self: Klass; target: Type<Klass>; propertyKey: symbol | string}
) => unknown;

export interface BindInjectablePropertyOpts<T = any> {
  token?: TokenProvider;
  useOpts?: Record<string, unknown>;
  transform?: TransformInjectedProviderCB<T>;
}

function bindInjectableProperty<T = any>(
  target: any,
  propertyKey: string | symbol,
  {token, transform = (o) => o, useOpts}: BindInjectablePropertyOpts<T>
) {
  const symbol = Symbol();

  if (!target[DI_INJECTABLE_PROPS]) {
    Reflect.defineProperty(target, DI_INJECTABLE_PROPS, {
      value: new Set(),
      enumerable: false,
      configurable: false
    });
  }

  target[DI_INJECTABLE_PROPS].add(propertyKey);

  catchError(() => Reflect.deleteProperty(target, propertyKey));
  Reflect.defineProperty(target, propertyKey, {
    get() {
      const useType = getTokenType(token, target, propertyKey!);
      const originalType = Metadata.getType(target, propertyKey);

      const invokeOpts: Partial<InvokeOptions> = {
        rebuild: !!this[DI_INVOKE_OPTIONS]?.rebuild,
        locals: this[DI_INVOKE_OPTIONS]?.locals,
        useOpts: useOpts || Store.from(target, propertyKey).get(DI_USE_OPTIONS)
      };

      if (this[symbol] === undefined) {
        this[symbol] = originalType === Array ? injectMany(token as string, invokeOpts) : inject(useType, invokeOpts);
      }

      [].concat(this[symbol]).forEach((instance: any, index) => {
        if (isPromise(this[symbol])) {
          instance.then((result: any) => {
            this[symbol]![index] = result;
            if (originalType !== Array) {
              this[symbol] = result;
            }
          });
        }
      });

      return transform(this[symbol], {self: this, target, propertyKey});
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
 * @param token A token provider or token provider group
 * @param transform
 * @returns {Function}
 * @decorator
 */
export function Inject<T = any>(token?: TokenProvider<T> | (() => TokenProvider<T>), transform?: TransformInjectedProviderCB<T>): any;
export function Inject<T = any>(
  token?: TokenProvider<T> | (() => TokenProvider<T>),
  opts?: Partial<Omit<BindInjectablePropertyOpts<T>, "token">>
): any;
export function Inject<T = any>(
  token?: TokenProvider<T> | (() => TokenProvider<T>),
  opts: TransformInjectedProviderCB<T> | Partial<Omit<BindInjectablePropertyOpts<T>, "token">> = {}
) {
  opts = typeof opts === "function" ? {transform: opts} : opts;

  return (target: any, propertyKey: string | symbol | undefined, index?: number) => {
    const bindingType = decoratorTypeOf([target, propertyKey, index]);

    switch (bindingType) {
      case DecoratorTypes.PARAM_CTOR:
        if (token) {
          setToken(token, {target, propertyKey, parameterIndex: index!});
        }
        break;
      case DecoratorTypes.PROP:
        bindInjectableProperty(target, propertyKey!, {...opts, token});
    }
  };
}
