import {Type} from "@tsed/core";
import {Injectable, InjectorService, ProviderScope} from "@tsed/di";
import {EndpointMetadata, HandlerConstructorOptions, HandlerMetadata, HandlerType, IPipe, ParamMetadata, ParamTypes} from "../../mvc";
import {HandlerContext} from "../domain/HandlerContext";
import {ParamValidationError} from "../errors/ParamValidationError";

/**
 * Platform Handler abstraction layer. Wrap original class method to a pure platform handler (Express, Koa, etc...).
 * @platform
 */
@Injectable({
  scope: ProviderScope.SINGLETON
})
export class PlatformHandler {
  constructor(protected injector: InjectorService) {}

  /**
   * Create a native middleware based on the given metadata and return an instance of HandlerContext
   * @param metadata
   */
  createHandler(metadata: HandlerMetadata | any) {
    if (!(metadata instanceof HandlerMetadata)) {
      metadata = this.createHandlerMetadata(metadata);
    }

    if ([HandlerType.CONTROLLER, HandlerType.MIDDLEWARE].includes(metadata.type)) {
      this.sortPipes(metadata);
    }

    return this.createRawHandler(metadata);
  }

  /**
   * Create handler metadata
   * @param obj
   */
  public createHandlerMetadata(obj: any | EndpointMetadata) {
    const {injector} = this;
    let options: HandlerConstructorOptions;

    if (obj instanceof EndpointMetadata) {
      const provider = injector.getProvider(obj.token)!;

      options = {
        token: provider.token,
        target: provider.useClass,
        type: HandlerType.CONTROLLER,
        propertyKey: obj.propertyKey
      };
    } else {
      const provider = injector.getProvider(obj);

      if (provider) {
        options = {
          token: provider.token,
          target: provider.useClass,
          type: HandlerType.MIDDLEWARE,
          propertyKey: "use"
        };
      } else {
        options = {
          target: obj,
          type: HandlerType.FUNCTION
        };
      }
    }

    return new HandlerMetadata(options);
  }

  /**
   * Get argument from parameter medata or handler context.
   * @param type
   * @param h
   */
  protected getArg(type: ParamTypes | string, h: HandlerContext) {
    const {
      ctx,
      ctx: {request, response}
    } = h;

    switch (type) {
      case ParamTypes.FILES:
        return h.request.files;

      case ParamTypes.RESPONSE:
        return h.response;

      case ParamTypes.REQUEST:
        return h.request;

      case ParamTypes.NEXT_FN:
        return h.next;

      case ParamTypes.ERR:
        return h.err;

      case ParamTypes.$CTX: // tsed ctx
        return ctx;

      case ParamTypes.ENDPOINT_INFO:
        return ctx.endpoint;

      case ParamTypes.RESPONSE_DATA:
        return ctx.data;

      case ParamTypes.BODY:
        return request.body;

      case ParamTypes.QUERY:
        return request.query;

      case ParamTypes.PATH:
        return request.params;

      case ParamTypes.HEADER:
        return request.headers;

      case ParamTypes.COOKIES:
        return request.cookies;

      case ParamTypes.SESSION:
        return request.session;

      case ParamTypes.LOCALS:
        return response.locals;

      default:
        return h.request;
    }
  }

  /**
   * Call handler when a request his handle
   * @param h
   */
  protected async onRequest(h: HandlerContext): Promise<any> {
    if (h.isDone) {
      return;
    }

    try {
      h.args = await this.getArgs(h);

      await h.callHandler();
    } catch (error) {
      return this.onError(error, h);
    }
  }

  /**
   * Implement how the handler should handle error.
   * @param error
   * @param h
   */
  protected onError(error: unknown, h: HandlerContext): any {
    return h.next(error);
  }

  /**
   * create Raw handler
   * @param metadata
   */
  protected createRawHandler(metadata: HandlerMetadata): Function {
    return (request: any, response: any, next: any) =>
      this.onRequest(
        new HandlerContext({
          injector: this.injector,
          request,
          response,
          res: response,
          req: request,
          next,
          metadata,
          args: []
        })
      );
  }

  /**
   * Return arguments to
   * @param h
   */
  private async getArgs(h: HandlerContext) {
    const {
      metadata: {parameters}
    } = h;

    return Promise.all(parameters.map((param) => this.mapArg(param, h)));
  }

  /**
   *
   * @param metadata
   */
  private sortPipes(metadata: HandlerMetadata) {
    const get = (pipe: Type<any>) => {
      return this.injector.getProvider(pipe)!.priority || 0;
    };

    metadata.parameters.forEach((param: ParamMetadata) => {
      return (param.pipes = param.pipes.sort((p1: Type<any>, p2: Type<any>) => {
        return get(p1) < get(p2) ? -1 : get(p1) > get(p2) ? 1 : 0;
      }));
    });
  }

  /**
   *
   * @param metadata
   * @param h
   */
  private async mapArg(metadata: ParamMetadata, h: HandlerContext) {
    const {injector} = h;
    const value = this.getArg(metadata.paramType, h);

    // istanbul ignore next
    const handleError = async (cb: Function) => {
      try {
        return await cb();
      } catch (er) {
        throw ParamValidationError.from(metadata, er);
      }
    };

    return metadata.pipes.reduce(async (value, pipe) => {
      value = await value;

      return handleError(() => injector.get<IPipe>(pipe)!.transform(value, metadata));
    }, value);
  }
}
