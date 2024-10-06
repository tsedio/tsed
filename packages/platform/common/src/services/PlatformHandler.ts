import {AnyPromiseResult, AnyToPromiseStatus, catchAsyncError} from "@tsed/core";
import {Inject, Injectable, Provider, ProviderScope} from "@tsed/di";
import {PlatformExceptions} from "@tsed/platform-exceptions";
import {PlatformParams, PlatformParamsCallback} from "@tsed/platform-params";
import {PlatformResponseFilter} from "@tsed/platform-response-filter";
import {
  AlterEndpointHandlersArg,
  PlatformHandlerMetadata,
  PlatformHandlerType,
  PlatformRouters,
  useResponseHandler
} from "@tsed/platform-router";
import {JsonOperationRoute} from "@tsed/schema";

import {AnyToPromiseWithCtx} from "../domain/AnyToPromiseWithCtx.js";
import {PlatformContext} from "../domain/PlatformContext.js";
import {setResponseHeaders} from "../utils/setResponseHeaders.js";
import {PlatformApplication} from "./PlatformApplication.js";
import {PlatformMiddlewaresChain} from "./PlatformMiddlewaresChain.js";

/**
 * Platform Handler abstraction layer. Wrap original class method to a pure platform handler (Express, Koa, etc...).
 * @platform
 */
@Injectable({
  scope: ProviderScope.SINGLETON
})
export class PlatformHandler {
  @Inject()
  protected responseFilter: PlatformResponseFilter;

  @Inject()
  protected platformParams: PlatformParams;

  @Inject()
  protected platformExceptions: PlatformExceptions;

  @Inject()
  protected platformApplication: PlatformApplication;

  @Inject()
  protected platformMiddlewaresChain: PlatformMiddlewaresChain;

  constructor(protected platformRouters: PlatformRouters) {
    // configure the router module
    platformRouters.hooks
      .on("alterEndpointHandlers", (handlers: AlterEndpointHandlersArg, operationRoute: JsonOperationRoute) => {
        handlers = this.platformMiddlewaresChain.get(handlers, operationRoute);

        handlers.after.push(useResponseHandler(this.flush.bind(this)));

        return handlers;
      })
      .on("alterHandler", (handlerMetadata: PlatformHandlerMetadata) => {
        const handler = handlerMetadata.isInjectable() ? this.createHandler(handlerMetadata) : handlerMetadata.handler;

        return this.platformApplication.adapter.mapHandler(handler, handlerMetadata);
      });
  }

  createHandler(handlerMetadata: PlatformHandlerMetadata): any {
    const handler = this.platformParams.compileHandler(handlerMetadata);

    return ($ctx: PlatformContext) => {
      $ctx.handlerMetadata = handlerMetadata;

      return this.onRequest(handler, $ctx);
    };
  }

  /**
   * @param provider
   * @param propertyKey
   */
  createCustomHandler(provider: Provider, propertyKey: string) {
    const metadata = new PlatformHandlerMetadata({
      provider,
      type: PlatformHandlerType.CUSTOM,
      propertyKey
    });

    return this.createHandler(metadata);
  }

  /**
   * Call handler when a request his handle
   */
  async onRequest(handler: PlatformParamsCallback, $ctx: PlatformContext) {
    const {handlerMetadata} = $ctx;

    if (handlerMetadata.type === PlatformHandlerType.CTX_FN) {
      return handler({$ctx});
    }

    const resolver = new AnyToPromiseWithCtx($ctx);

    const response = await resolver.call(handler);
    // Note: restore previous handler metadata (for OIDC)
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

    // set headers each times that an endpoint is called
    if ($ctx.handlerMetadata.isEndpoint()) {
      setResponseHeaders($ctx);
    }
  }

  /**
   * Send the response to the consumer.
   * @protected
   * @param $ctx
   */
  async flush($ctx: PlatformContext) {
    if (!$ctx.error) {
      $ctx.error = await catchAsyncError(async () => {
        const {response} = $ctx;

        if (!$ctx.isDone()) {
          let data = await this.responseFilter.serialize($ctx.data, $ctx as any);
          data = await this.responseFilter.transform(data, $ctx as any);
          response.body(data);
        }
      });
    }

    if ($ctx.error) {
      this.platformExceptions.catch($ctx.error, $ctx);
    }
  }
}
