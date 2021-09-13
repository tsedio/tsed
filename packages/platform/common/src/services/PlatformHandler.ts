import {AnyToPromiseStatus, isBoolean, isFunction, isNumber, isStream, isString} from "@tsed/core";
import {Injectable, InjectorService, Provider, ProviderScope} from "@tsed/di";
import {$log} from "@tsed/logger";
import {ParamMetadata, PlatformParams} from "@tsed/platform-params";
import {PlatformResponseFilter} from "@tsed/platform-response-filter";
import {renderView} from "@tsed/platform-views";
import {EndpointMetadata} from "../domain/EndpointMetadata";
import {HandlerContext} from "../domain/HandlerContext";
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
   * Create a native middleware based on the given metadata and return an instance of HandlerContext
   * @param input
   * @param options
   */
  createHandler(input: EndpointMetadata | HandlerMetadata | any, options: PlatformRouteWithoutHandlers = {}) {
    const metadata: HandlerMetadata = this.createHandlerMetadata(input, options);
    this.buildPipe(metadata);
    return this.createRawHandler(metadata);
  }

  createCustomHandler(provider: Provider, propertyKey: string) {
    const metadata = new HandlerMetadata({
      token: provider.provide,
      target: provider.useClass,
      type: HandlerType.CUSTOM,
      scope: provider.scope,
      propertyKey
    });
    this.buildPipe(metadata);
    return this.createRawHandler(metadata);
  }

  /**
   * Create handler metadata
   * @param obj
   * @param routeOptions
   */
  public createHandlerMetadata(obj: any | EndpointMetadata, routeOptions: PlatformRouteWithoutHandlers = {}): HandlerMetadata {
    return createHandlerMetadata(this.injector, obj, routeOptions);
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

  protected async onCtxRequest(requestOptions: OnRequestOptions): Promise<any> {
    const {metadata, $ctx} = requestOptions;

    await metadata.handler($ctx);

    return this.next(requestOptions);
  }

  /**
   * Call handler when a request his handle
   * @param requestOptions
   */
  protected async onRequest(requestOptions: OnRequestOptions): Promise<any> {
    // istanbul ignore next
    if (!requestOptions.$ctx) {
      $log.error(
        `Endpoint ${requestOptions.metadata.toString()} is called but the response is already send to your consumer. Check your code and his middlewares please!`
      );
      return;
    }

    const h = new HandlerContext({
      ...requestOptions,
      args: []
    });

    const {$ctx} = h;

    return this.injector.runInContext($ctx, async () => {
      try {
        h.args = await this.getArgs(h);

        const {state} = await h.callHandler();

        if (state === AnyToPromiseStatus.RESOLVED) {
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
  protected createRawHandler(metadata: HandlerMetadata): Function {
    switch (metadata.type) {
      case HandlerType.CUSTOM:
        return (ctx: PlatformContext, next: any) => this.onRequest({metadata, next, $ctx: ctx});
      case HandlerType.RAW_ERR_FN:
      case HandlerType.RAW_FN:
        return metadata.handler;

      default:
      case HandlerType.ENDPOINT:
      case HandlerType.MIDDLEWARE:
        return (request: any, response: any, next: any) => this.onRequest({metadata, next, $ctx: request.$ctx});
    }
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

  private buildPipe(metadata: HandlerMetadata) {
    if (metadata.injectable) {
      return metadata.parameters.forEach((param: ParamMetadata) => {
        this.params.build(param);
      });
    }
  }

  private getArgs(h: HandlerContext) {
    const {metadata} = h;

    if (metadata.injectable) {
      return this.params.getArgs(h, metadata.parameters);
    }

    return [metadata.hasErrorParam && h.err, h.$ctx.request.request, h.$ctx.response.response, metadata.hasNextFunction && h.next].filter(
      Boolean
    );
  }
}
