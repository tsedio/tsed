import {isBoolean, isFunction, isNumber, isStream, isString} from "@tsed/core";
import {Inject, Injectable, InjectorService, Provider, ProviderScope} from "@tsed/di";
import {$log} from "@tsed/logger";
import {
  ConverterService,
  EndpointMetadata,
  HandlerMetadata,
  HandlerType,
  ParamMetadata,
  ParamTypes,
  PlatformRouteWithoutHandlers
} from "../../mvc";
import {PlatformResponseFilter} from "../../platform-response-filter/services/PlatformResponseFilter";
import {HandlerContext, HandlerContextStatus} from "../domain/HandlerContext";
import {PlatformContext} from "../domain/PlatformContext";
import {ParamValidationError} from "../errors/ParamValidationError";
import {createHandlerMetadata} from "../utils/createHandlerMetadata";
import {renderView} from "../utils/renderView";
import {setResponseHeaders} from "../utils/setResponseHeaders";

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
  @Inject()
  protected injector: InjectorService;

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

  /**
   * Allow handler hack for AsyncHookContext plugin.
   * @param $ctx
   * @param cb
   * @protected
   */
  run($ctx: PlatformContext, cb: any) {
    return cb();
  }

  /**
   * Get argument from parameter medata or handler context.
   * @param type
   * @param h
   */
  protected getArg(type: ParamTypes | string, h: HandlerContext) {
    const {$ctx} = h;

    switch (type) {
      case ParamTypes.NODE_RESPONSE:
        return $ctx.getRes();

      case ParamTypes.NODE_REQUEST:
        return $ctx.getReq();

      case ParamTypes.FILES:
        return $ctx.getRequest().files;

      case ParamTypes.RESPONSE:
        return $ctx.getResponse();

      case ParamTypes.REQUEST:
        return $ctx.getRequest();

      case ParamTypes.PLATFORM_RESPONSE:
        return $ctx.response;

      case ParamTypes.PLATFORM_REQUEST:
        return $ctx.request;

      case ParamTypes.NEXT_FN:
        return h.next;

      case ParamTypes.ERR:
        return h.err;

      case ParamTypes.$CTX: // tsed ctx
        return $ctx;

      case ParamTypes.ENDPOINT_INFO:
        return $ctx.endpoint;

      case ParamTypes.RESPONSE_DATA:
        return $ctx.data;

      case ParamTypes.BODY:
        return $ctx.request.body;

      case ParamTypes.RAW_BODY:
        return $ctx.request.rawBody;

      case ParamTypes.QUERY:
        return $ctx.request.query;

      case ParamTypes.PATH:
        return $ctx.request.params;

      case ParamTypes.HEADER:
        return $ctx.request.headers;

      case ParamTypes.COOKIES:
        return $ctx.request.cookies;

      case ParamTypes.SESSION:
        return $ctx.request.session;

      case ParamTypes.LOCALS:
        return $ctx.response.locals;

      default:
        return $ctx.getRequest();
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

    return this.run($ctx, async () => {
      try {
        h.args = await this.getArgs(h);

        await h.callHandler();

        if (h.status === HandlerContextStatus.RESOLVED) {
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

  private buildPipe(metadata: HandlerMetadata) {
    if (metadata.injectable) {
      metadata.parameters.forEach((param: ParamMetadata) => {
        param.cachePipes(this.injector);
      });
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

  /**
   * Return arguments to call handler
   * @param h
   */
  private async getArgs(h: HandlerContext) {
    const {
      metadata: {parameters}
    } = h;

    return Promise.all(parameters.map((param) => this.mapArg(param, h)));
  }

  /**
   * Map argument by calling pipe.
   * @param metadata
   * @param h
   */
  private async mapArg(metadata: ParamMetadata, h: HandlerContext) {
    const value = this.getArg(metadata.paramType, h);

    return metadata.getPipes().reduce(async (value, pipe) => {
      value = await value;

      try {
        return await pipe.transform(value, metadata);
      } catch (er) {
        throw ParamValidationError.from(metadata, er);
      }
    }, value);
  }
}
