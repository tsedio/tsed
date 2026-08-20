import {AnyPromiseResult, AnyToPromiseStatus} from "@tsed/core";
import {inject, injectable, Provider, ProviderScope} from "@tsed/di";
import {$alter} from "@tsed/hooks";
import {PlatformParams, PlatformParamsCallback} from "@tsed/platform-params";
import {AlterEndpointHandlersArg, PlatformHandlerMetadata, PlatformHandlerType, PlatformRouters} from "@tsed/platform-router";
import {JsonOperationRoute} from "@tsed/schema";
import {AnyToPromiseWithCtx} from "../domain/AnyToPromiseWithCtx.js";
import {PlatformContext} from "../domain/PlatformContext.js";
import {setResponseHeaders} from "../utils/setResponseHeaders.js";
import {PlatformAdapter} from "./PlatformAdapter.js";

/**
 * Compiles decorated Ts.ED handlers into portable context functions and
 * registers the router compilation hooks. Response preparation and host
 * writes intentionally belong to the Fetch execution boundary.
 * @internal
 */
export class PlatformHandler {
  protected platformParams = inject(PlatformParams);
  protected platformRouters = inject(PlatformRouters);
  protected platformAdapter = inject(PlatformAdapter);

  constructor() {
    this.platformRouters.hooks
      .on("alterEndpointHandlers", (handlers: AlterEndpointHandlersArg, operationRoute: JsonOperationRoute) => {
        handlers = $alter("$alterEndpointHandlers", handlers, [operationRoute]);

        return handlers;
      })
      .on("alterHandler", (handlerMetadata: PlatformHandlerMetadata) => {
        const handler = handlerMetadata.isInjectable() ? this.createHandler(handlerMetadata) : handlerMetadata.handler;
        handlerMetadata.compiledHandler = handler;

        return this.platformAdapter.mapHandler(handler as any, handlerMetadata);
      });
  }

  createHandler(handlerMetadata: PlatformHandlerMetadata): any {
    const handler = this.platformParams.compileHandler(handlerMetadata);

    return ($ctx: PlatformContext) => {
      $ctx.handlerMetadata = handlerMetadata;

      return this.onRequest(handler, $ctx);
    };
  }

  createCustomHandler(provider: Provider, propertyKey: string) {
    const metadata = new PlatformHandlerMetadata({
      provider,
      type: PlatformHandlerType.CUSTOM,
      propertyKey
    });

    return this.createHandler(metadata);
  }

  async onRequest(handler: PlatformParamsCallback, $ctx: PlatformContext) {
    const {handlerMetadata} = $ctx;

    if (handlerMetadata.type === PlatformHandlerType.CTX_FN) {
      return handler({$ctx});
    }

    const resolver = new AnyToPromiseWithCtx($ctx);
    const response = await resolver.call(handler);
    $ctx.handlerMetadata = handlerMetadata;

    if (response.state === AnyToPromiseStatus.RESOLVED && !$ctx.isDone()) {
      return this.onResponse(response, $ctx);
    }
  }

  onResponse({status, data, headers}: AnyPromiseResult, $ctx: PlatformContext) {
    if (status) {
      $ctx.response.status(status);
    }

    if (headers) {
      $ctx.response.setHeaders(headers);
    }

    if (data !== undefined) {
      $ctx.data = data;
    }

    $ctx.error = null;

    if ($ctx.handlerMetadata.isEndpoint()) {
      setResponseHeaders($ctx);
    }
  }
}

injectable(PlatformHandler).scope(ProviderScope.SINGLETON);
