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
export interface ExecuteFetchContextOptions {
  start?: boolean;
  finish?: boolean;
}

/**
 * Executes portable work for an already-created context. Host bridges use this
 * entry point after attaching their native request and response objects.
 */
export async function executeFetchContext(
  $ctx: PlatformContext,
  execute: PlatformFetchContextHandler,
  {start = true, finish = true}: ExecuteFetchContextOptions = {}
): Promise<Response> {
  try {
    start && (await $ctx.start());
    $ctx.error = await runInContext($ctx, () => catchAsyncError(() => execute($ctx)));

    await injector().get<PlatformHandler>(PlatformHandler)!.prepareResponse($ctx);
    return $ctx.response.finalize();
  } finally {
    finish && (await $ctx.finish());
  }
}

/**
 * Creates the direct Fetch execution boundary. Route compilation supplies the
 * portable handler; host bridges only need to convert requests and responses
 * around this function.
 */
export function createFetchHandler(execute: PlatformFetchContextHandler): PlatformFetchHandler {
  return async (request, runtime) => {
    const $ctx = createFetchContext(request, runtime);

    return executeFetchContext($ctx, execute);
  };
}
