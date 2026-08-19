import {PlatformHandlerType, type PlatformHandlerMetadata} from "@tsed/platform-router";
import type {PlatformContext} from "../domain/PlatformContext.js";
import type {PlatformFetchContextHandler} from "./createFetchHandler.js";

/**
 * Creates the portable execution function for a route already selected by a
 * host framework. It deliberately performs no route matching or native
 * middleware invocation.
 */
export function executeFetchRoute(handlers: PlatformHandlerMetadata[]): PlatformFetchContextHandler {
  return async ($ctx: PlatformContext) => {
    for (const metadata of handlers) {
      if (
        metadata.type === PlatformHandlerType.RESPONSE_FN ||
        metadata.type === PlatformHandlerType.RAW_FN ||
        metadata.type === PlatformHandlerType.RAW_ERR_FN
      ) {
        continue;
      }

      await (metadata.compiledHandler || metadata.handler)($ctx);
      if ($ctx.isDone()) {
        return;
      }
    }
  };
}
