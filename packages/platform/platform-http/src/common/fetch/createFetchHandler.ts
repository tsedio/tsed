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

async function parseFetchBody($ctx: PlatformContext) {
  const request = $ctx.request.fetch!;
  if (!request.body) {
    return;
  }

  const rawBody = new Uint8Array(await request.arrayBuffer());
  const text = new TextDecoder().decode(rawBody);
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    $ctx.request.setBody(text ? JSON.parse(text) : undefined, rawBody);
    return;
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const body = [...new URLSearchParams(text).entries()].reduce(
      (form, [key, value]) => {
        const current = form[key];
        form[key] = current === undefined ? value : Array.isArray(current) ? [...current, value] : [current, value];
        return form;
      },
      {} as Record<string, string | string[]>
    );
    $ctx.request.setBody(body, rawBody);
    return;
  }

  $ctx.request.setBody(contentType.startsWith("text/") ? text : rawBody, rawBody);
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
      $ctx.error = await runInContext($ctx, () =>
        catchAsyncError(async () => {
          await parseFetchBody($ctx);
          return execute($ctx);
        })
      );

      return await injector().get<PlatformHandler>(PlatformHandler)!.finalizeResponse($ctx);
    } finally {
      await $ctx.finish();
    }
  };
}
