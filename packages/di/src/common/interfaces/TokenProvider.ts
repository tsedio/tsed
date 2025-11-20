import type {AbstractType, Type} from "@tsed/core";

/**
 * Factory token type with type inference support.
 *
 * A branded type that enables type inference when using the `inject()` function.
 * This token type carries runtime type information to solve TypeScript's inference limitations in DI scenarios.
 *
 * @typeParam T - The type of value provided by this token
 * @public
 */
export type FactoryTokenProvider<T = any> = T & {readonly __type: "token_factory"};

/**
 * Union type representing all valid provider tokens in the DI system.
 *
 * A token uniquely identifies a provider in the dependency injection container.
 * Tokens can be strings, symbols, class constructors, or factory tokens with type inference.
 *
 * ### Usage
 *
 * ```typescript
 * // String token
 * const token1: TokenProvider = "MY_SERVICE";
 *
 * // Symbol token
 * const token2: TokenProvider = Symbol.for("MY_SERVICE");
 *
 * // Class token
 * const token3: TokenProvider = MyService;
 *
 * // Factory token with inference
 * const token4 = inject<MyService>();
 * ```
 *
 * @typeParam T - The type of value provided by this token
 * @public
 */
export type TokenProvider<T = any> = string | symbol | Type<T> | AbstractType<T> | FactoryTokenProvider<T>;
