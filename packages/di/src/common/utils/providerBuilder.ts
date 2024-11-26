import "../registries/ProviderRegistry.js";

import {Store, type Type} from "@tsed/core";

import {ProviderType} from "../domain/ProviderType.js";
import {injector} from "../fn/injector.js";
import type {ProviderOpts} from "../interfaces/ProviderOpts.js";
import type {TokenProvider} from "../interfaces/TokenProvider.js";
import {GlobalProviders} from "../registries/GlobalProviders.js";

type ProviderBuilder<Token extends TokenProvider, BaseProvider, T extends object> = {
  [K in keyof T as T[K] extends (...args: any[]) => any ? never : K]: (value: T[K]) => ProviderBuilder<Token, BaseProvider, T>;
} & {
  inspect(): BaseProvider;
  store(): Store;
  token(): Token;
  factory(f: (...args: unknown[]) => unknown): ProviderBuilder<Token, BaseProvider, T>;
  asyncFactory(f: (...args: unknown[]) => Promise<unknown>): ProviderBuilder<Token, BaseProvider, T>;
  value(v: unknown): ProviderBuilder<Token, BaseProvider, T>;
  class(c: Type): ProviderBuilder<Token, BaseProvider, T>;
};

export function providerBuilder<Provider, Picked extends keyof Provider>(props: string[], baseOpts: Partial<ProviderOpts<Provider>> = {}) {
  return <Token extends TokenProvider>(
    token: Token,
    options: Partial<ProviderOpts<Type>> = {}
  ): ProviderBuilder<Token, Provider, Pick<Provider, Picked>> => {
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
        factory(factory: any) {
          provider.useFactory = factory;
          return this;
        },
        asyncFactory(asyncFactory: any) {
          provider.useAsyncFactory = asyncFactory;
          return this;
        },
        value(value: any) {
          provider.useValue = value;
          provider.type = ProviderType.VALUE;
          return this;
        },
        class(k: any) {
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
          return provider.token as Token;
        }
      } as ProviderBuilder<Token, Provider, Pick<Provider, Picked>>
    );
  };
}
