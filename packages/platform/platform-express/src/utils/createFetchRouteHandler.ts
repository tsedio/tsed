import type {Request as ExpressRequest, Response as ExpressResponse} from "express";
import {createFetchContext, executeFetchContext, executeFetchRoute} from "@tsed/platform-http";
import type {PlatformHandlerMetadata} from "@tsed/platform-router";
import {createFetchRequest} from "./createFetchRequest.js";
import {writeFetchResponse} from "./writeFetchResponse.js";

/**
 * Adapts a route selected by Express to the shared Fetch-native Ts.ED
 * execution pipeline. Express retains route matching and parameter extraction.
 */
export function createFetchRouteHandler(handlers: PlatformHandlerMetadata[]) {
  const executeRoute = executeFetchRoute(handlers);

  return async (request: ExpressRequest, response: ExpressResponse) => {
    const $ctx = createFetchContext(createFetchRequest(request), undefined, {request, response});
    $ctx.request.setParams(request.params as Record<string, string>);

    try {
      const fetchResponse = await executeFetchContext($ctx, executeRoute, {finish: false});
      await writeFetchResponse($ctx, fetchResponse);
    } finally {
      await $ctx.finish();
    }
  };
}
