import type {Context} from "koa";
import {createFetchContext, executeFetchContext, executeFetchRoute, type PlatformContext} from "@tsed/platform-http";
import type {PlatformHandlerMetadata} from "@tsed/platform-router";
import {createFetchRequest} from "./createFetchRequest.js";
import {writeFetchResponse} from "./writeFetchResponse.js";

/** Executes a Koa-selected route through the shared Fetch-native pipeline. */
export function createFetchRouteHandler(handlers: PlatformHandlerMetadata[]) {
  const executeRoute = executeFetchRoute(handlers);

  return async (context: Context) => {
    const existingContext = (context.request as typeof context.request & {$ctx?: PlatformContext}).$ctx;

    const $ctx = existingContext?.fetch
      ? existingContext
      : createFetchContext(createFetchRequest(context), undefined, {
          event: {request: context.request, response: context.response, koaContext: context},
          accessors: createKoaRequestAccessors(context)
        });

    const ownsContext = $ctx !== existingContext;

    try {
      ownsContext && (await $ctx.start());
      const response = await executeFetchContext($ctx, executeRoute);
      writeFetchResponse($ctx, response);
    } finally {
      ownsContext && (await $ctx.finish());
    }
  };
}

function createKoaRequestAccessors(context: Context) {
  const request = context.request as typeof context.request & {body?: unknown; rawBody?: unknown; files?: unknown};

  return {
    body: () => request.body,
    rawBody: () => request.rawBody,
    params: () => context.params || {},
    session: () => (context as Context & {session?: unknown}).session,
    files: () => request.files,
    accepts: (mime?: string | string[]) => context.accepts(mime as any) || false
  };
}
