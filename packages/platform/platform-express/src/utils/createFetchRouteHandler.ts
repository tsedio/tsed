import type {Request as ExpressRequest, Response as ExpressResponse} from "express";
import {createFetchContext, createHostBridgeHandler, executeFetchRoute} from "@tsed/platform-http";
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
  const bridge = {
    name: "express",
    getContext: ({request}: {request: ExpressRequest}) => (request as ExpressRequest & {$ctx?: ReturnType<typeof createFetchContext>}).$ctx,
    createContext: ({request, response}: {request: ExpressRequest; response: ExpressResponse}) =>
      createFetchContext(createFetchRequest(request), undefined, {
        event: {request, response},
        accessors: createExpressRequestAccessors(request)
      }),
    writeResponse: writeFetchResponse
  };
  const handler = createHostBridgeHandler(bridge, executeRoute);

  return (request: ExpressRequest, response: ExpressResponse) => handler({request, response});
}
