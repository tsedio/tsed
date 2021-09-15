import {AnyToPromiseStatus, isBoolean, isFunction, isNumber, isStream, isString} from "@tsed/core";
import {Injectable, InjectorService, Provider, ProviderScope} from "@tsed/di";
import {$log} from "@tsed/logger";
import {ArgScope, HandlerWithScope, PlatformParams} from "@tsed/platform-params";
import {PlatformResponseFilter} from "@tsed/platform-response-filter";
import {renderView} from "@tsed/platform-views";
import {AnyToPromiseWithCtx} from "../domain/AnyToPromiseWithCtx";
import {EndpointMetadata} from "../domain/EndpointMetadata";
import {HandlerMetadata} from "../domain/HandlerMetadata";
import {PlatformContext} from "../domain/PlatformContext";
import {HandlerType} from "../interfaces/HandlerType";
import {PlatformRouteWithoutHandlers} from "../interfaces/PlatformRouteOptions";
import {createHandlerMetadata} from "../utils/createHandlerMetadata";
import {setResponseHeaders} from "../utils/setResponseHeaders";
import {ConverterService} from "./ConverterService";

export interface OnRequestOptions {
  $ctx: PlatformContext;
  metadata: HandlerMetadata;
  handler: HandlerWithScope;
  next?: any;
  err?: any;

  [key: string]: any;
}

function shouldBeSent(data: any) {
  return Buffer.isBuffer(data) || isBoolean(data) || isNumber(data) || isString(data) || data === null;
}

function shouldBeSerialized(data: any) {
  return !(isStream(data) || shouldBeSent(data) || data === undefined);
}

/**
 * Platform Handler abstraction layer. Wrap original class method to a pure platform handler (Express, Koa, etc...).
 * @platform
 */
@Injectable({
  scope: ProviderScope.SINGLETON
})
export class PlatformHandler {
  constructor(protected injector: InjectorService, protected params: PlatformParams) {}

  /**
   * Create a native middleware based on the given metadata and return an instance of AnyToPromiseWithCtx
   * @param input
   * @param options
   */
  createHandler(input: EndpointMetadata | HandlerMetadata | any, options: PlatformRouteWithoutHandlers = {}) {
    return this.createRawHandler(createHandlerMetadata(this.injector, input, options));
  }

  /**
   * Create injectable handler from the given provider
   * @param provider
   * @param propertyKey
   */
  createCustomHandler(provider: Provider, propertyKey: string) {
    const handler = this.compileHandler(
      new HandlerMetadata({
        token: provider.provide,
        target: provider.useClass,
        type: HandlerType.CUSTOM,
        scope: provider.scope,
        propertyKey
      })
    );

    return async ($ctx: PlatformContext, next?: any) =>
      handler({
        $ctx,
        next
      });
  }

  /**
   * Send the response to the consumer.
   * @param data
   * @param ctx
   * @protected
   */
  async flush(data: any, ctx: PlatformContext) {
    const {response, endpoint} = ctx;

    if (endpoint) {
      if (endpoint.view) {
        data = await this.render(data, ctx);
      } else if (shouldBeSerialized(data)) {
        data = this.injector.get<ConverterService>(ConverterService)!.serialize(data, {
          ...endpoint.getResponseOptions(),
          endpoint: true
        });
      }
    }

    if (!response.isDone()) {
      const responseFilter = this.injector.get<PlatformResponseFilter>(PlatformResponseFilter)!;

      response.body(responseFilter.transform(data, ctx));
    }
  }

  compileHandler(metadata: HandlerMetadata) {
    if (metadata.type === HandlerType.CTX_FN) {
      return async (scope: Record<string, any>) => {
        // @ts-ignore
        return this.onCtxRequest({
          ...scope,
          handler: () => metadata.handler(scope.$ctx),
          metadata
        });
      };
    }

    const promise = this.params.compileHandler<PlatformContext>({
      token: metadata.token,
      propertyKey: metadata.propertyKey,
      getCustomArgs: metadata.injectable ? undefined : this.getDefaultArgs(metadata)
    });

    return async (scope: Record<string, any>) => {
      const handler = await promise;
      // @ts-ignore
      return this.onRequest({
        ...scope,
        handler,
        metadata
      });
    };
  }

  protected async onCtxRequest(requestOptions: OnRequestOptions): Promise<any> {
    await requestOptions.handler(requestOptions);

    return this.next(requestOptions);
  }

  /**
   * Call handler when a request his handle
   * @param requestOptions
   */
  protected async onRequest(requestOptions: OnRequestOptions): Promise<any> {
    const {$ctx, metadata, err, handler} = requestOptions;
    // istanbul ignore next
    if (!$ctx) {
      $log.error(
        `Endpoint ${metadata.toString()} is called but the response is already send to your consumer. Check your code and his middlewares please!`
      );
      return;
    }

    const resolver = new AnyToPromiseWithCtx({$ctx, err});

    return this.injector.runInContext($ctx, async () => {
      try {
        const {state, data, status, headers} = await resolver.call(handler);

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
          return await this.onSuccess($ctx.data, requestOptions);
        }
      } catch (er) {
        return this.onError(er, requestOptions);
      }
    });
  }

  protected async onError(er: unknown, requestOptions: OnRequestOptions) {
    const {next, $ctx} = requestOptions;
    $ctx.data = er;

    if (!next) {
      throw er;
    }

    return !$ctx.response.isHeadersSent() && next && next(er);
  }

  /**
   * Manage success scenario
   * @param data
   * @param requestOptions
   * @protected
   */
  protected async onSuccess(data: any, requestOptions: OnRequestOptions) {
    const {metadata, $ctx, next} = requestOptions;

    // TODO see this control is necessary
    // istanbul ignore next
    if ($ctx.request.isAborted() || $ctx.response.isDone()) {
      return;
    }

    // set headers each times that an endpoint is called
    if (metadata.type === HandlerType.ENDPOINT) {
      this.setHeaders($ctx);
    }

    // call returned middleware
    if (isFunction(data) && !isStream(data)) {
      return this.callReturnedMiddleware(data, $ctx, next);
    }

    if (metadata.isFinal()) {
      return this.flush(data, $ctx);
    }

    return this.next(requestOptions);
  }

  /**
   * Call the returned middleware by the handler.
   * @param middleware
   * @param ctx
   * @param next
   * @protected
   */
  protected callReturnedMiddleware(middleware: any, ctx: PlatformContext, next: any) {
    return middleware(ctx.getRequest(), ctx.getResponse(), next);
  }

  /**
   * Render the view if the endpoint has a configured view.
   * @param data
   * @param ctx
   * @protected
   */
  protected async render(data: any, ctx: PlatformContext) {
    return renderView(data, ctx);
  }

  /**
   * create Raw handler
   * @param metadata
   */
  protected createRawHandler(metadata: HandlerMetadata) {
    if ([HandlerType.RAW_ERR_FN, HandlerType.RAW_FN].includes(metadata.type)) {
      return metadata.handler;
    }

    const handler = this.compileHandler(metadata);

    return async (request: any, response: any, next: any) => {
      return handler({
        next,
        $ctx: request.$ctx
      });
    };
  }

  /**
   * Set response headers
   * @param ctx
   * @protected
   */
  protected setHeaders(ctx: PlatformContext) {
    return setResponseHeaders(ctx);
  }

  protected next(requestOptions: OnRequestOptions) {
    const {$ctx, next} = requestOptions;

    return !$ctx.response.isDone() && next && next();
  }

  protected getDefaultArgs(metadata: HandlerMetadata) {
    return async (scope: ArgScope<PlatformContext>) =>
      [
        metadata.hasErrorParam && scope.err,
        scope.$ctx.request.request,
        scope.$ctx.response.response,
        metadata.hasNextFunction && scope.next
      ].filter(Boolean);
  }
}
