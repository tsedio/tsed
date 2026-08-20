import {catchAsyncError} from "@tsed/core";
import {inject, runInContext} from "@tsed/di";
import {PlatformExceptions} from "@tsed/platform-exceptions";
import {PlatformResponseFilter} from "@tsed/platform-response-filter";
import type {PlatformContext} from "../domain/PlatformContext.js";
import {createFetchContext} from "../utils/createContext.js";
import type {PlatformFetchHandler} from "./PlatformFetchHandler.js";

/**
 * Compiled portable work executed for one Fetch request.
 */
export type PlatformFetchContextHandler = ($ctx: PlatformContext) => unknown | Promise<unknown>;
export interface ExecuteFetchContextOptions {
  start?: boolean;
  finish?: boolean;
}

/**
 * Executes portable work for an already-created context. Host bridges use this
 * entry point after attaching their native request and response objects.
 */
export async function executeFetchContext($ctx: PlatformContext, execute: PlatformFetchContextHandler): Promise<Response> {
  $ctx.error = await runInContext($ctx, () => catchAsyncError(() => execute($ctx)));

  if (!$ctx.error) {
    $ctx.error = await catchAsyncError(async () => {
      if (!$ctx.isDone()) {
        const data = await inject(PlatformResponseFilter).transform($ctx.data, $ctx as any);
        $ctx.response.body(data);
      }
    });
  }

  if ($ctx.error) {
    inject(PlatformExceptions).catch($ctx.error, $ctx);
  }

  return $ctx.response.finalize();
}

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
      return await executeFetchContext($ctx, execute);
    } finally {
      await $ctx.finish();
    }
  };
}
