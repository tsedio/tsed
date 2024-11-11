import {isFunction} from "@tsed/core";

import type {TokenProvider} from "../interfaces/TokenProvider.js";
import {injector} from "./injector.js";

/**
 * Lazy load a provider from his package and invoke only when the provider is used.
 */
export async function lazyInject<Token>(factory: () => Promise<{default: TokenProvider<Token>}>): Promise<Token> {
  const {default: token} = await factory();

  let instance: any = injector().get(token);

  if (!instance) {
    instance = await injector().invoke(token);

    if ("$onInit" in instance && isFunction(instance?.$onInit)) {
      await instance.$onInit();
    }
  }

  return instance;
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
