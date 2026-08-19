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

      if (metadata.opts.native) {
        throw new Error("native() middleware requires a compatible host bridge and cannot run through Fetch directly");
      }

      if (metadata.type === PlatformHandlerType.RESPONSE_FN) {
        return dispatch(index + 1);
      }

      let called = false;
      const previousNext = $ctx.next;
      const next = async () => {
        if (called) {
          throw new Error("A portable middleware continuation can only be called once");
        }

        called = true;
        await dispatch(index + 1);
      };

      try {
        $ctx.next = next;
        const handler = (metadata.compiledHandler || metadata.handler) as ($ctx: PlatformContext, next: () => Promise<void>) => unknown;
        await handler($ctx, next);
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
