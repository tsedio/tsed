import type {Context} from "koa";
import {createFetchContext, createHostBridgeHandler, executeFetchRoute, type PlatformContext} from "@tsed/platform-http";
import type {PlatformHandlerMetadata} from "@tsed/platform-router";
import {createFetchRequest} from "./createFetchRequest.js";
import {createKoaRequestAccessors} from "./createKoaRequestAccessors.js";
import {writeFetchResponse} from "./writeFetchResponse.js";

/** Executes a Koa-selected route through the shared Fetch-native pipeline. */
export function createFetchRouteHandler(handlers: PlatformHandlerMetadata[]) {
  const executeRoute = executeFetchRoute(handlers);
  const bridge = {
    name: "koa",
    getContext: ({request}: {request: Context["request"]}) => (request as typeof request & {$ctx?: PlatformContext}).$ctx,
    createContext: ({request, response, koaContext}: {request: Context["request"]; response: Context["response"]; koaContext: Context}) =>
      createFetchContext(createFetchRequest(koaContext), undefined, {
        event: {request, response, koaContext},
        accessors: createKoaRequestAccessors(koaContext)
      }),
    writeResponse: writeFetchResponse
  };
  const handler = createHostBridgeHandler(bridge, executeRoute);

  return (context: Context) => handler({request: context.request, response: context.response, koaContext: context});
}
