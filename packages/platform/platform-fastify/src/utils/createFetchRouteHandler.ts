import type {FastifyReply, FastifyRequest} from "fastify";
import {createFetchContext, executeFetchContext, executeFetchRoute, type PlatformContext} from "@tsed/platform-http";
import type {PlatformHandlerMetadata} from "@tsed/platform-router";
import {createFetchRequest} from "./createFetchRequest.js";
import {writeFetchResponse} from "./writeFetchResponse.js";

/** Executes a Fastify-selected route through the shared Fetch-native pipeline. */
export function createFetchRouteHandler(handlers: PlatformHandlerMetadata[]) {
  const executeRoute = executeFetchRoute(handlers);

  return async (request: FastifyRequest, reply: FastifyReply) => {
    const existingContext = (request as FastifyRequest & {$ctx?: PlatformContext}).$ctx;
    const $ctx = existingContext?.fetch
      ? existingContext
      : createFetchContext(createFetchRequest(request), undefined, {request, response: reply});
    const ownsContext = $ctx !== existingContext;
    $ctx.request.setParams(request.params as Record<string, string>);
    $ctx.request.setBody(
      () => request.body,
      () => (request as FastifyRequest & {rawBody?: unknown}).rawBody
    );

    try {
      await executeFetchContext($ctx, executeRoute, {start: ownsContext, finish: false});
      await writeFetchResponse($ctx);
    } finally {
      ownsContext && (await $ctx.finish());
    }
  };
}
