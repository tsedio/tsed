import type {PlatformContext} from "../domain/PlatformContext.js";
import {executeFetchContext, type PlatformFetchContextHandler} from "./createFetchHandler.js";
import type {PlatformHostBridge, PlatformNativeContext} from "./PlatformHostBridge.js";

/** Native callback installed by a host bridge for a route it has already selected. */
export type PlatformHostBridgeHandler<NativeRequest = unknown, NativeResponse = unknown> = (
  native: PlatformNativeContext<NativeRequest, NativeResponse>
) => Promise<void>;

/**
 * Runs the shared Fetch-native execution cycle for a route selected by a host
 * bridge. Request conversion, native capabilities, and response writing stay
 * in the bridge; routing and body parsing stay outside `platform-http`.
 */
export function createHostBridgeHandler<NativeRequest = unknown, NativeResponse = unknown>(
  bridge: PlatformHostBridge<NativeRequest, NativeResponse>,
  execute: PlatformFetchContextHandler
): PlatformHostBridgeHandler<NativeRequest, NativeResponse> {
  return async (native) => {
    const $ctx: PlatformContext = await bridge.createContext(native);

    try {
      await $ctx.start();
      const response = await executeFetchContext($ctx, execute);
      await bridge.writeResponse($ctx, response);
    } finally {
      await $ctx.finish();
    }
  };
}
