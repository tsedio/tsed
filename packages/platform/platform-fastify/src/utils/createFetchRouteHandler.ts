import type {FastifyReply, FastifyRequest} from "fastify";
import {createFetchContext, executeFetchContext, executeFetchRoute, type PlatformContext} from "@tsed/platform-http";
import type {PlatformHandlerMetadata} from "@tsed/platform-router";
import {createFetchRequest} from "./createFetchRequest.js";
import {createFastifyRequestAccessors} from "./createFastifyRequestAccessors.js";
import {writeFetchResponse} from "./writeFetchResponse.js";

/** Executes a Fastify-selected route through the shared Fetch-native pipeline. */
export function createFetchRouteHandler(handlers: PlatformHandlerMetadata[]) {
  const executeRoute = executeFetchRoute(handlers);

  return async (request: FastifyRequest, reply: FastifyReply) => {
    const existingContext = (request as FastifyRequest & {$ctx?: PlatformContext}).$ctx;

    const $ctx = existingContext?.fetch
      ? existingContext
      : createFetchContext(createFetchRequest(request), undefined, {
          event: {request, response: reply},
          accessors: createFastifyRequestAccessors(request)
        });

    const ownsContext = $ctx !== existingContext;

    try {
      ownsContext && (await $ctx.start());
      const response = await executeFetchContext($ctx, executeRoute);
      await writeFetchResponse($ctx, response);
    } finally {
      ownsContext && (await $ctx.finish());
    }
  };
}
