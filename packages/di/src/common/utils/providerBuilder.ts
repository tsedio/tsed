import "../registries/ProviderRegistry.js";

import {Store, type Type} from "@tsed/core";

import {ProviderType} from "../domain/ProviderType.js";
import {injector} from "../fn/injector.js";
import type {ProviderOpts} from "../interfaces/ProviderOpts.js";
import type {FactoryTokenProvider, TokenProvider} from "../interfaces/TokenProvider.js";
import {GlobalProviders} from "../registries/GlobalProviders.js";

type BaseMethodsProvider<TypeOf, BaseProvider, T extends object> = {
  [K in keyof T as T[K] extends (...args: any[]) => any ? never : K]: (value: T[K]) => ProviderBuilder<TypeOf, BaseProvider, T>;
};

type ProviderBuilder<TypeOf, BaseProvider, T extends object> = BaseMethodsProvider<TypeOf, BaseProvider, T> & {
  inspect(): BaseProvider;
  store(): Store;
  token(): TypeOf;
  factory<FactoryReturn>(f: (...args: unknown[]) => FactoryReturn): ProviderBuilder<FactoryTokenProvider<FactoryReturn>, BaseProvider, T>;
  asyncFactory<FactoryReturn>(
    f: (...args: unknown[]) => Promise<FactoryReturn>
  ): ProviderBuilder<FactoryTokenProvider<FactoryReturn>, BaseProvider, T>;
  value<Value>(v: Value): ProviderBuilder<FactoryTokenProvider<Value>, BaseProvider, T>;
  class<TokenKlass>(c: Type<TokenKlass>): ProviderBuilder<TokenKlass, BaseProvider, T>;
};

export type ProviderBuilderFn<Provider, Picked extends keyof Provider> = <TypeOf extends TokenProvider>(
  token: TypeOf,
  options?: Partial<ProviderOpts<Type>>
) => ProviderBuilder<TypeOf, Provider, Pick<Provider, Picked>>;

export function providerBuilder<Provider, Picked extends keyof Provider>(
  props: string[],
  baseOpts: Partial<ProviderOpts<Provider>> = {}
): ProviderBuilderFn<Provider, Picked> {
  return <TypeOf extends TokenProvider>(token: TypeOf, options: Partial<ProviderOpts<Type>> = {}) => {
    const merged = {
      global: !injector().isLoaded(),
      ...options,
      ...baseOpts,
      token
    };

    const provider = GlobalProviders.merge(token, merged);

    if (!merged.global) {
      injector().setProvider(token, provider);
    }

    return props.reduce(
      (acc, prop) => {
        return {
          ...acc,
          [prop]: function (value: any) {
            (provider as any)[prop] = value;
            return this;
          }
        };
      },
      {
        factory(factory: Function) {
          provider.reset();
          provider.useFactory = factory;
          return this;
        },
        asyncFactory(asyncFactory: Function) {
          provider.reset();
          provider.useAsyncFactory = asyncFactory;
          return this;
        },
        value(value: any) {
          provider.reset();
          provider.useValue = value;
          provider.type = ProviderType.VALUE;
          return this;
        },
        class(k: any) {
          provider.reset();
          provider.useClass = k;
          return this;
        },
        store() {
          return provider.store;
        },
        inspect() {
          return provider;
        },
        token() {
          return provider.token as TypeOf;
        }
      } as ProviderBuilder<TypeOf, Provider, Pick<Provider, Picked>>
    );
  };
}
