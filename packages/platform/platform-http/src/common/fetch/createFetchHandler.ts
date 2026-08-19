import {catchAsyncError} from "@tsed/core";
import {injector, runInContext} from "@tsed/di";
import type {PlatformContext} from "../domain/PlatformContext.js";
import {PlatformHandler} from "../services/PlatformHandler.js";
import {createFetchContext} from "../utils/createContext.js";
import type {PlatformFetchHandler} from "./PlatformFetchHandler.js";

/**
 * Compiled portable work executed for one Fetch request.
 */
export type PlatformFetchContextHandler = ($ctx: PlatformContext) => unknown | Promise<unknown>;

/**
 * Creates the direct Fetch execution boundary. Route compilation supplies the
 * portable handler; host bridges only need to convert requests and responses
 * around this function.
 */
export function createFetchHandler(execute: PlatformFetchContextHandler): PlatformFetchHandler {
  return async (request, runtime) => {
    const $ctx = createFetchContext(request, runtime);

    try {
      await $ctx.start();
      $ctx.error = await runInContext($ctx, () => catchAsyncError(() => execute($ctx)));

      return await injector().get<PlatformHandler>(PlatformHandler)!.finalizeResponse($ctx);
    } finally {
      await $ctx.finish();
    }
  };
}
