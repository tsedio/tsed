import type {Request as ExpressRequest, Response as ExpressResponse} from "express";
import {createFetchContext, executeFetchContext, executeFetchRoute} from "@tsed/platform-http";
import type {PlatformHandlerMetadata} from "@tsed/platform-router";
import {createFetchRequest} from "./createFetchRequest.js";
import {createExpressRequestAccessors} from "./createExpressRequestAccessors.js";
import {writeFetchResponse} from "./writeFetchResponse.js";

/**
 * Adapts a route selected by Express to the shared Fetch-native Ts.ED
 * execution pipeline. Express retains route matching and parameter extraction.
 */
export function createFetchRouteHandler(handlers: PlatformHandlerMetadata[]) {
  const executeRoute = executeFetchRoute(handlers);

  return async (request: ExpressRequest, response: ExpressResponse) => {
    const existingContext = (request as ExpressRequest & {$ctx?: ReturnType<typeof createFetchContext>}).$ctx;
    const $ctx = existingContext?.fetch
      ? existingContext
      : createFetchContext(createFetchRequest(request), undefined, {
          event: {request, response},
          accessors: createExpressRequestAccessors(request)
        });
    const ownsContext = $ctx !== existingContext;

    try {
      ownsContext && (await $ctx.start());
      const fetchResponse = await executeFetchContext($ctx, executeRoute);
      await writeFetchResponse($ctx, fetchResponse);
    } finally {
      ownsContext && (await $ctx.finish());
    }
  };
}
