import {AnyToPromiseStatus, catchAsyncError, isFunction, isStream} from "@tsed/core";
import {Inject, Injectable, Provider, ProviderScope} from "@tsed/di";
import {$log} from "@tsed/logger";
import {PlatformParams, PlatformParamsCallback} from "@tsed/platform-params";
import {PlatformResponseFilter} from "@tsed/platform-response-filter";
import {PlatformContextHandler, PlatformHandlerMetadata, PlatformHandlerType, PlatformRouters} from "@tsed/platform-router";
import {promisify} from "util";
import {AnyToPromiseWithCtx} from "../domain/AnyToPromiseWithCtx";
import {PlatformContext} from "../domain/PlatformContext";
import {setResponseHeaders} from "../utils/setResponseHeaders";

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
  protected platformRouters: PlatformRouters;

  @Inject()
  protected platformParams: PlatformParams;

  createHandler(handler: PlatformParamsCallback, handlerMetadata: PlatformHandlerMetadata): PlatformContextHandler {
    return async ($ctx: PlatformContext) => {
      $ctx.handlerMetadata = handlerMetadata;

      const error = await catchAsyncError(() => this.onRequest(handler, $ctx));

      return this.next(error, $ctx.next, $ctx);
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

    return async ($ctx: PlatformContext) => {
      $ctx.set(PlatformHandlerMetadata, metadata);

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

    if (!response.isDone()) {
      let data = await this.responseFilter.serialize($ctx.data, $ctx as any);
      data = await this.responseFilter.transform(data, $ctx as any);
      response.body(data);
    }

    return response;
  }

  public setResponseHeaders($ctx: PlatformContext) {
    if (!$ctx.response.isDone()) {
      return setResponseHeaders($ctx);
    }
  }

  /**
   * @param error
   * @param next
   * @param $ctx
   */
  next(error: unknown, next: Function, $ctx: PlatformContext) {
    if (isStream($ctx.data) || $ctx.isDone()) {
      return;
    }

    return error ? next(error) : next();
  }

  /**
   * Call handler when a request his handle
   */
  async onRequest(handler: PlatformParamsCallback, $ctx: PlatformContext): Promise<any> {
    // istanbul ignore next$
    if ($ctx.isDone()) {
      $log.error({
        name: "HEADERS_SENT",
        message: `An endpoint is called but the response is already send to the client. The call comes from the handler: ${$ctx.handlerMetadata.toString()}`
      });
      return;
    }

    try {
      const {handlerMetadata} = $ctx;
      if (handlerMetadata.type === PlatformHandlerType.CTX_FN) {
        return await handler({$ctx});
      }

      const resolver = new AnyToPromiseWithCtx($ctx);

      const {state, data, status, headers} = await resolver.call(handler);

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

        // Can be canceled by the handler itself
        return await this.onSuccess($ctx);
      }
    } catch (error) {
      return this.onError(error, $ctx);
    }
  }

  protected async onError(error: unknown, $ctx: PlatformContext) {
    $ctx.error = error;

    throw error;
  }

  /**
   * Manage success scenario
   * @param $ctx
   * @protected
   */
  protected async onSuccess($ctx: PlatformContext) {
    // istanbul ignore next
    if ($ctx.isDone()) {
      return;
    }

    $ctx.error = null;

    const metadata = $ctx.handlerMetadata;

    // set headers each times that an endpoint is called

    if (metadata.isEndpoint()) {
      this.setResponseHeaders($ctx);
    }

    // call returned middleware
    if (isFunction($ctx.data) && !isStream($ctx.data)) {
      return promisify($ctx.data)($ctx.getRequest(), $ctx.getResponse());
    }

    if (metadata.isFinal()) {
      return this.flush($ctx);
    }
  }
}
