import type {Type} from "@tsed/core/types/Type.js";

import {Provider} from "../domain/Provider.js";
import {ProviderType} from "../domain/ProviderType.js";
import {injector} from "../fn/injector.js";
import type {ProviderOpts} from "../interfaces/ProviderOpts.js";
import type {FactoryTokenProvider, TokenProvider} from "../interfaces/TokenProvider.js";

declare global {
  namespace TsED {
    interface ClassProviderBuilder<Token extends Type> {}

    interface ProviderBuilder<Token> {}
  }
}

export class ProviderBuilder<Token> {
  protected provider: Provider<Token>;

  /**
   * Creates a new Provider Builder instance
   * @param options - Provider options including token and configuration
   */
  constructor(options: ProviderOpts<Token>) {
    options.global ||= !injector().isLoaded();

    let provider = Provider.Registry.get(options.token);

    if (!provider) {
      provider = new Provider(options.token, options);
      options.global && Provider.Registry.set(options.token, provider);
    } else {
      Object.keys(options).forEach((key) => {
        provider![key] = (options as never)[key];
      });
    }

    if (!options.global) {
      injector().setProvider(options.token, provider);
    }

    this.provider = provider;
  }

  static add<Keys extends keyof ClassProviderBuilder, Token extends Type>(
    property: Keys,
    method: (providerBuilder: AnyProviderBuilder<Token>) => ClassProviderBuilder<Token>[Keys]
  ): typeof ProviderBuilder;
  static add<Keys extends keyof AnyProviderBuilder, Token extends TokenProvider>(
    property: Keys,
    method: (providerBuilder: AnyProviderBuilder<Token>) => AnyProviderBuilder<Token>[Keys]
  ): typeof ProviderBuilder;
  static add<Keys extends keyof AnyProviderBuilder, Token extends TokenProvider>(
    property: Keys,
    method: (providerBuilder: AnyProviderBuilder<Token>) => AnyProviderBuilder<Token>[Keys]
  ): typeof ProviderBuilder {
    Object.defineProperty(ProviderBuilder.prototype, property, {
      value: method
    });

    return ProviderBuilder;
  }

  /**
   * Sets the provider scope
   * @param scope - The scope to set for this provider
   * @returns Current builder instance
   */
  scope(scope: Provider["scope"]): ProviderBuilder<Token> {
    this.provider.scope = scope;
    return this;
  }

  /**
   * Sets the provider path
   * @param path - The path to set for this provider
   * @returns Current builder instance
   */
  path(path: Provider["path"]): ProviderBuilder<Token> {
    this.provider.path = path;
    return this;
  }

  /**
   * Sets the provider alias
   * @param alias - The alias to set for this provider
   * @returns Current builder instance
   */
  alias(alias: Provider["alias"]): ProviderBuilder<Token> {
    this.provider.alias = alias;
    return this;
  }

  /**
   * Sets the provider hooks
   * @param hooks - The hooks to set for this provider
   * @returns Current builder instance
   */
  hooks(hooks: Provider["hooks"]): ProviderBuilder<Token> {
    this.provider.hooks = hooks;
    return this;
  }

  /**
   * Sets the provider dependencies
   * @param deps - The dependencies to set for this provider
   * @returns Current builder instance
   */
  deps(deps: Provider["deps"]): ProviderBuilder<Token> {
    this.provider.deps = deps;
    return this;
  }

  /**
   * Sets the provider imports
   * @param imports - The imports to set for this provider
   * @returns Current builder instance
   */
  imports(imports: Provider["imports"]): ProviderBuilder<Token> {
    this.provider.imports = imports;
    return this;
  }

  /**
   * Sets the provider configuration
   * @param configuration - The configuration to set for this provider
   * @returns Current builder instance
   */
  configuration(configuration: Provider["configuration"]): ProviderBuilder<Token> {
    this.provider.configuration = configuration;
    return this;
  }

  /**
   * Sets the provider priority
   * @param priority - The priority to set for this provider
   * @returns Current builder instance
   */
  priority(priority: Provider["priority"]): ProviderBuilder<Token> {
    this.provider.priority = priority;
    return this;
  }

  /**
   * Sets the provider type
   * @param type - The type to set for this provider
   * @returns Current builder instance
   */
  type(type: Provider["type"]): ProviderBuilder<Token> {
    this.provider.type = type;
    return this;
  }

  /**
   * Sets the provider children
   * @param children - The children to set for this provider
   * @returns Current builder instance
   */
  children(children: Provider["children"]): ProviderBuilder<Token> {
    this.provider.children = children;
    return this;
  }

  /**
   * Sets the provider middlewares
   * @param middlewares - The middlewares to set for this provider
   * @returns Current builder instance
   */
  middlewares(middlewares: Provider["middlewares"]): ProviderBuilder<Token> {
    this.provider.middlewares = middlewares;
    return this;
  }

  /**
   * Sets a factory function for the provider
   * @param factory - Factory function that creates provider instances
   * @returns Builder instance with updated factory type
   */
  factory<FactoryReturn>(factory: (...args: unknown[]) => FactoryReturn): ProviderBuilder<FactoryTokenProvider<FactoryReturn>> {
    this.provider.reset();
    this.provider.useFactory = factory;

    return this as ProviderBuilder<FactoryTokenProvider<FactoryReturn>>;
  }

  /**
   * Sets an async factory function for the provider
   * @param asyncFactory - Async factory function that creates provider instances
   * @returns Builder instance with updated factory type
   */
  asyncFactory<FactoryReturn>(
    asyncFactory: (...args: unknown[]) => Promise<FactoryReturn>
  ): ProviderBuilder<FactoryTokenProvider<FactoryReturn>> {
    this.provider.reset();
    this.provider.useAsyncFactory = asyncFactory;

    return this as ProviderBuilder<FactoryTokenProvider<FactoryReturn>>;
  }

  /**
   * Sets a static value for the provider
   * @param value - Value to be provided
   * @returns Builder instance with value type
   */
  value<Value>(value: Value): ProviderBuilder<FactoryTokenProvider<Value>> {
    this.provider.reset();
    this.provider.useValue = value;
    this.provider.type = ProviderType.VALUE;

    return this as ProviderBuilder<FactoryTokenProvider<Value>>;
  }

  /**
   * Sets the class to be used by the provider
   * @param k - Class type to be provided
   * @returns Builder instance with class type
   */
  class<TokenKlass>(k: Type<TokenKlass>): ProviderBuilder<TokenKlass> {
    this.provider.reset();
    this.provider.useClass = k;

    return this as unknown as ProviderBuilder<TokenKlass>;
  }

  /**
   * Gets the provider's store
   * @returns Provider store instance
   */
  store() {
    return this.provider.store;
  }

  /**
   * Gets the underlying provider instance
   * @returns Provider instance
   */
  inspect() {
    return this.provider;
  }

  /**
   * Gets the provider's token
   * @returns Provider token
   */
  token() {
    return this.provider.token as Token;
  }

  /**
   * Sets a value in the provider's store
   * @param key - Key to store the value under
   * @param value - Value to store
   * @returns Current builder instance
   */
  set(key: string, value: unknown): ProviderBuilder<Token> {
    this.store().set(key, value);
    return this;
  }
}

export type AnyProviderBuilder<Token extends TokenProvider = any> = ProviderBuilder<Token> & TsED.ProviderBuilder<Token>;

export type ClassProviderBuilder<Token extends Type = any> = AnyProviderBuilder<Token> & TsED.ClassProviderBuilder<Token>;

export function providerBuilder(baseOpts: Partial<ProviderOpts> = {}) {
  function factory<Token extends Type>(token: Token, options?: Partial<ProviderOpts>): ClassProviderBuilder<Token>;
  function factory<Token extends TokenProvider>(token: Token, options?: Partial<ProviderOpts>): AnyProviderBuilder<Token>;
  function factory<Token>(token: Token, options: Partial<ProviderOpts> = {}) {
    return new ProviderBuilder<Token>({
      token,
      ...baseOpts,
      ...options
    });
  }

  return factory;
}
