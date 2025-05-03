import type {AbstractType, Type} from "@tsed/core";

/**
 * A token is a unique identifier for a provider in the dependency injection system.
 * It solves the inference problem when using `inject()` function.
 */
export type FactoryTokenProvider<T = any> = T & {readonly __type: "token_factory"};
export type TokenProvider<T = any> = string | symbol | Type<T> | AbstractType<T> | FactoryTokenProvider<T>;
