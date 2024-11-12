import {isFunction} from "@tsed/core";

import type {TokenProvider} from "../interfaces/TokenProvider.js";
import {injector} from "./injector.js";

/**
 * Lazy load a provider from his package and invoke only when the provider is used.
 */
export async function lazyInject<Token>(factory: () => Promise<{default: TokenProvider<Token>}>): Promise<Token> {
  const {default: token} = await factory();

  let instance = injector().get(token) as unknown;

  if (!instance) {
    instance = await injector().invoke(token);

    const instanceWithHook = instance as unknown as {$onInit?: () => Promise<void>};

    if ("$onInit" in instanceWithHook && isFunction(instanceWithHook.$onInit)) {
      await instanceWithHook.$onInit();
    }
  }

  return instance as unknown as Promise<Token>;
}

export async function optionalLazyInject<Token>(
  factory: () => Promise<{
    default: TokenProvider;
  }>
): Promise<Token | undefined> {
  try {
    return await lazyInject(factory);
  } catch (er) {
    return undefined;
  }
}
