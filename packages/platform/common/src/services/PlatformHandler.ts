import {AnyToPromiseResponseTypes, AnyToPromiseStatus, catchAsyncError, isFunction, isStream} from "@tsed/core";
import {Inject, Injectable, Provider, ProviderScope} from "@tsed/di";
import {$log} from "@tsed/logger";
import {PlatformExceptions} from "@tsed/platform-exceptions";
import {PlatformParams, PlatformParamsCallback} from "@tsed/platform-params";
import {PlatformResponseFilter} from "@tsed/platform-response-filter";
import {PlatformHandlerMetadata, PlatformHandlerType, PlatformRouters, useResponseHandler} from "@tsed/platform-router";
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
      .on("alterEndpointHandlers", (allMiddlewares: any[], operationRoute: JsonOperationRoute) => {
        allMiddlewares = this.platformMiddlewaresChain.get(allMiddlewares, operationRoute);

        return [...allMiddlewares, useResponseHandler(this.onFinish.bind(this))];
      })
      .on("alterHandler", (handlerMetadata: PlatformHandlerMetadata) => {
        return this.platformApplication.adapter.mapHandler(this.createHandler(handlerMetadata), handlerMetadata);
      });
  }

  createHandler(handlerMetadata: PlatformHandlerMetadata): any {
    if (handlerMetadata.isInjectable()) {
      const handler = this.platformParams.compileHandler(handlerMetadata);

      return async ($ctx: PlatformContext) => {
        $ctx.handlerMetadata = handlerMetadata;

        await catchAsyncError(() => this.onRequest(handler, $ctx));

        return this.next($ctx);
      };
    }

    return handlerMetadata.handler;
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

    return async ($ctx: PlatformContext) => {
      $ctx.handlerMetadata = metadata;

      // @ts-ignore
      return this.onRequest(handler, $ctx);
    };
  }

  /**
   * Send the response to the consumer.
   * @protected
   * @param $ctx
   */
  async flush($ctx: PlatformContext) {
    const {response} = $ctx;

    if (!$ctx.isDone()) {
      let data = await this.responseFilter.serialize($ctx.data, $ctx as any);
      data = await this.responseFilter.transform(data, $ctx as any);
      response.body(data);
    }
  }

  /**
   * @param $ctx
   */
  next($ctx: PlatformContext) {
    if (isStream($ctx.data) || $ctx.isDone()) {
      return;
    }

    return $ctx.error ? $ctx.next($ctx.error) : $ctx.next();
  }

  /**
   * Call handler when a request his handle
   */
  async onRequest(handler: PlatformParamsCallback, $ctx: PlatformContext): Promise<any> {
    if ($ctx.isDone()) {
      $log.error({
        name: "HEADERS_SENT",
        message: `An endpoint is called but the response is already send to the client. The call comes from the handler: ${$ctx.handlerMetadata.toString()}`
      });
      return;
    }

    if (($ctx.error instanceof Error && !$ctx.handlerMetadata.hasErrorParam) || ($ctx.handlerMetadata.hasErrorParam && !$ctx.error)) {
      return;
    }

    try {
      const {handlerMetadata} = $ctx;

      if (handlerMetadata.type === PlatformHandlerType.CTX_FN) {
        return await handler({$ctx});
      }

      const resolver = new AnyToPromiseWithCtx($ctx);

      const {state, type, data, status, headers} = await resolver.call(handler);

      // Note: restore previous handler metadata (for OIDC)
      $ctx.handlerMetadata = handlerMetadata;

      if (state === AnyToPromiseStatus.RESOLVED) {
        if (status) {
          $ctx.response.status(status);
        }

        if (headers) {
          $ctx.response.setHeaders(headers);
        }

        if (data !== undefined) {
          $ctx.data = data;
        }

        if (!$ctx.isDone()) {
          $ctx.error = null;

          // set headers each times that an endpoint is called
          if (handlerMetadata.isEndpoint()) {
            setResponseHeaders($ctx);
          }

          // call returned middleware
          if (isFunction($ctx.data) && !isStream($ctx.data)) {
            return promisify($ctx.data)($ctx.getRequest(), $ctx.getResponse());
          }

          if (type === AnyToPromiseResponseTypes.STREAM) {
            return this.flush($ctx);
          }
        }
      }
    } catch (error) {
      $ctx.error = error;

      throw error;
    }
  }

  async onFinish($ctx: PlatformContext) {
    $ctx.error = await catchAsyncError(() => this.flush($ctx));

    return $ctx.error && this.platformExceptions.catch($ctx.error, $ctx);
  }
}
