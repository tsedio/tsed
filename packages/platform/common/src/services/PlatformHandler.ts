import {AnyToPromiseStatus, catchAsyncError, isFunction, isStream} from "@tsed/core";
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
import {promisify} from "util";
import {AnyToPromiseWithCtx} from "../domain/AnyToPromiseWithCtx";
import {PlatformContext} from "../domain/PlatformContext";
import {setResponseHeaders} from "../utils/setResponseHeaders";
import {PlatformApplication} from "./PlatformApplication";
import {PlatformMiddlewaresChain} from "./PlatformMiddlewaresChain";

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

    return async ($ctx: PlatformContext) => {
      $ctx.handlerMetadata = handlerMetadata;

      await this.onRequest(handler, $ctx);

      return this.next($ctx);
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

    const handler = this.platformParams.compileHandler(metadata.store);

    return ($ctx: PlatformContext) => {
      $ctx.handlerMetadata = metadata;

      // @ts-ignore
      return this.onRequest(handler, $ctx);
    };
  }

  /**
   * Call handler when a request his handle
   */
  async onRequest(handler: PlatformParamsCallback, $ctx: PlatformContext): Promise<any> {
    try {
      const {handlerMetadata} = $ctx;

      if (handlerMetadata.type === PlatformHandlerType.CTX_FN) {
        return await handler({$ctx});
      }

      const resolver = new AnyToPromiseWithCtx($ctx);

      const {state, type, data, status, headers} = await resolver.call(handler);
      // Note: restore previous handler metadata (for OIDC)
      $ctx.handlerMetadata = handlerMetadata;

      if (state === AnyToPromiseStatus.RESOLVED && !$ctx.isDone()) {
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
        if (handlerMetadata.isEndpoint()) {
          setResponseHeaders($ctx);
        }

        // call returned middleware
        if (isFunction($ctx.data) && !isStream($ctx.data)) {
          return promisify($ctx.data)($ctx.getRequest(), $ctx.getResponse());
        }
      }
    } catch (error) {
      $ctx.error = error;
      // TODO on v8, we have to use platformExceptions.catch directly. Error middleware won't be supported anymore
      throw error;
    }
  }

  /**
   * @param $ctx
   */
  next($ctx: PlatformContext) {
    return $ctx.next && $ctx.error ? $ctx.next($ctx.error) : $ctx.next();
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
