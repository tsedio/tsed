import {
  AlterEndpointHandlersArg,
  PlatformHandlerMetadata,
  PlatformHandlerType,
  PlatformRouters,
  useResponseHandler
} from "@tsed/platform-router";
import {AnyPromiseResult, AnyToPromiseStatus, isPromise, type MaybePromise} from "@tsed/core";
import {PlatformParams, PlatformParamsCallback} from "@tsed/platform-params";
import {Provider, ProviderScope, inject, injectable} from "@tsed/di";
import {$alter} from "@tsed/hooks";
import {AnyToPromiseWithCtx} from "../domain/AnyToPromiseWithCtx.js";
import {JsonOperationRoute} from "@tsed/schema";
import {PlatformAdapter} from "./PlatformAdapter.js";
import {PlatformContext} from "../domain/PlatformContext.js";
import {PlatformExceptions} from "@tsed/platform-exceptions";
import {PlatformResponseFilter} from "@tsed/platform-response-filter";
import {setResponseHeaders} from "../utils/setResponseHeaders.js";

/**
 * Platform Handler abstraction layer. Wrap original class method to a pure platform handler (Express, Koa, etc...).
 * @platform
 */
export class PlatformHandler {
  protected responseFilter = inject(PlatformResponseFilter);
  protected platformParams = inject(PlatformParams);
  protected platformExceptions = inject(PlatformExceptions);
  protected platformRouters = inject(PlatformRouters);

  constructor() {
    // configure the router module
    this.platformRouters.hooks
      .on("alterEndpointHandlers", (handlers: AlterEndpointHandlersArg, operationRoute: JsonOperationRoute) => {
        handlers = $alter("$alterEndpointHandlers", handlers, [operationRoute]);

        handlers.after.push(useResponseHandler(this.flush.bind(this) as any));

        return handlers;
      })
      .on("alterHandler", (handlerMetadata: PlatformHandlerMetadata) => {
        const handler = handlerMetadata.isInjectable() ? this.createHandler(handlerMetadata) : handlerMetadata.handler;
        handlerMetadata.compiledHandler = handler;
        return inject(PlatformAdapter).mapHandler(handler as any, handlerMetadata);
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
   * Call handler when a request his handle.
   *
   * Returns a promise only when the handler (or `onResponse()`) has to be awaited: a synchronous handler is
   * handled in the same tick, and an error it throws is thrown synchronously.
   */
  onRequest(handler: PlatformParamsCallback, $ctx: PlatformContext): MaybePromise<unknown> {
    const {handlerMetadata} = $ctx;

    if (handlerMetadata.type === PlatformHandlerType.CTX_FN) {
      return handler({$ctx});
    }

    const response = new AnyToPromiseWithCtx($ctx).run(handler);

    if (isPromise(response)) {
      return response.then((response) => this.onResult(response, handlerMetadata, $ctx));
    }

    return this.onResult(response, handlerMetadata, $ctx);
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
   *
   * Returns a promise only when the response filters have to be awaited: otherwise the body is sent in the same tick.
   * @protected
   * @param $ctx
   */
  flush($ctx: PlatformContext): MaybePromise<void> {
    if (!$ctx.error && !$ctx.isDone()) {
      try {
        const data = this.responseFilter.resolveBody($ctx.data, $ctx as any);

        if (isPromise(data)) {
          return data.then(
            (data) => this.send(data, $ctx),
            (er) => this.send(undefined, $ctx, er)
          );
        }

        $ctx.response.body(data);
      } catch (er) {
        $ctx.error = er;
      }
    }

    this.catchError($ctx);
  }

  private onResult(response: AnyPromiseResult, handlerMetadata: PlatformHandlerMetadata, $ctx: PlatformContext) {
    // Note: restore previous handler metadata (for OIDC)
    $ctx.handlerMetadata = handlerMetadata;

    if (response.state === AnyToPromiseStatus.RESOLVED && !$ctx.isDone()) {
      return this.onResponse(response, $ctx);
    }
  }

  private send(data: unknown, $ctx: PlatformContext, error?: unknown) {
    if (error) {
      $ctx.error = error;
    } else {
      try {
        $ctx.response.body(data);
      } catch (er) {
        $ctx.error = er;
      }
    }

    this.catchError($ctx);
  }

  private catchError($ctx: PlatformContext) {
    if ($ctx.error) {
      this.platformExceptions.catch($ctx.error, $ctx);
    }
  }
}

injectable(PlatformHandler).scope(ProviderScope.SINGLETON);
