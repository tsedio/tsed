import {PlatformHandlerType, type PlatformHandlerMetadata} from "@tsed/platform-router";
import type {PlatformContext, PlatformNext} from "../domain/PlatformContext.js";
import type {PlatformFetchContextHandler} from "./createFetchHandler.js";

export type {PlatformNext} from "../domain/PlatformContext.js";

/** Runtime-neutral middleware function accepted by `Use*` decorators. */
export type PlatformMiddleware = ($ctx: PlatformContext) => unknown | Promise<unknown>;

/**
 * Creates the portable execution function for a route already selected by a
 * host framework. It deliberately performs no route matching or native
 * middleware invocation.
 */
export function executeFetchRoute(handlers: PlatformHandlerMetadata[]): PlatformFetchContextHandler {
  return async ($ctx: PlatformContext) => {
    let cursor = -1;

    const dispatch = async (index: number): Promise<void> => {
      if (index <= cursor) {
        throw new Error("A portable middleware continuation can only be called once");
      }

      cursor = index;
      const metadata = handlers[index];

      if (!metadata || $ctx.isDone()) {
        return;
      }

      if (metadata.opts.native || metadata.isRawMiddleware()) {
        throw new Error("Native middleware requires a compatible host bridge and cannot run through Fetch directly");
      }

      if (metadata.isInjectable() && metadata.hasNextFunction) {
        throw new Error("@Next() is not supported by the portable middleware pipeline; declare use(ctx) and await ctx.next?.() instead");
      }

      if (metadata.type === PlatformHandlerType.RESPONSE_FN) {
        return dispatch(index + 1);
      }

      let called = false;
      const previousNext = $ctx.next;
      const next: PlatformNext = async () => {
        if (called) {
          throw new Error("A portable middleware continuation can only be called once");
        }

        called = true;
        await dispatch(index + 1);
      };

      try {
        $ctx.next = next;
        const handler = (metadata.compiledHandler || metadata.handler) as PlatformMiddleware;
        await handler($ctx);
      } finally {
        $ctx.next = previousNext;
      }

      if (!called && !$ctx.isDone()) {
        await dispatch(index + 1);
      }
    };

    await dispatch(0);
  };
}
