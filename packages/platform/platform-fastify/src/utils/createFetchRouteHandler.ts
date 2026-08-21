import type {FastifyReply, FastifyRequest} from "fastify";
import {createFetchContext, createHostBridgeHandler, executeFetchRoute, type PlatformContext} from "@tsed/platform-http";
import type {PlatformHandlerMetadata} from "@tsed/platform-router";
import {createFetchRequest} from "./createFetchRequest.js";
import {createFastifyRequestAccessors} from "./createFastifyRequestAccessors.js";
import {writeFetchResponse} from "./writeFetchResponse.js";

/** Executes a Fastify-selected route through the shared Fetch-native pipeline. */
export function createFetchRouteHandler(handlers: PlatformHandlerMetadata[]) {
  const executeRoute = executeFetchRoute(handlers);
  const bridge = {
    name: "fastify",
    getContext: ({request}: {request: FastifyRequest}) => (request as FastifyRequest & {$ctx?: PlatformContext}).$ctx,
    createContext: ({request, response}: {request: FastifyRequest; response: FastifyReply}) =>
      createFetchContext(createFetchRequest(request), undefined, {
        event: {request, response},
        accessors: createFastifyRequestAccessors(request)
      }),
    writeResponse: writeFetchResponse
  };
  const handler = createHostBridgeHandler(bridge, executeRoute);

  return (request: FastifyRequest, response: FastifyReply) => handler({request, response});
}
