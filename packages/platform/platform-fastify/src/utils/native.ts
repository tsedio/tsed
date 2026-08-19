import {createNativeMiddleware, type NativeMiddleware} from "@tsed/platform-router";

/**
 * Marks a host middleware as native. Fastify plugins remain bootstrap-time
 * registrations and are not valid `Use*` inputs.
 */
export function native<T>(handler: T): NativeMiddleware<T> {
  return createNativeMiddleware(handler);
}
