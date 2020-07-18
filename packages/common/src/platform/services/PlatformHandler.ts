import {Type} from "@tsed/core";
import {Injectable, InjectorService, ProviderScope} from "@tsed/di";
import {
  EndpointMetadata,
  HandlerMetadata,
  HandlerType,
  IFilter,
  IHandlerConstructorOptions,
  IPipe,
  ParamMetadata,
  ParamTypes
} from "../../mvc";
import {ValidationError} from "../../mvc/errors/ValidationError";
import {HandlerContext} from "../domain/HandlerContext";
import {ParamValidationError} from "../errors/ParamValidationError";
import {UnknownFilterError} from "../errors/UnknownFilterError";

@Injectable({
  scope: ProviderScope.SINGLETON
})
export class PlatformHandler {
  constructor(protected injector: InjectorService) {}

  createHandlerMetadata(obj: any | EndpointMetadata) {
    const {injector} = this;
    let options: IHandlerConstructorOptions;

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
   * Create a native middleware based on the given metadata and return an instance of HandlerContext
   * @param metadata
   */
  createHandler(metadata: HandlerMetadata | any) {
    if (!(metadata instanceof HandlerMetadata)) {
      metadata = this.createHandlerMetadata(metadata);
    }

    if (metadata.type === HandlerType.FUNCTION) {
      return metadata.handler;
    }

    this.sortPipes(metadata);

    return this.createRawHandler(metadata);
  }

  /**
   * Get param from the context
   * @param param
   * @param context
   */
  getParam(param: ParamMetadata, context: HandlerContext) {
    switch (param.paramType) {
      case ParamTypes.FORM_DATA:
        return context.request;

      case ParamTypes.RESPONSE:
        return context.response;

      case ParamTypes.REQUEST:
        return context.request;

      case ParamTypes.NEXT_FN:
        return context.next;

      case ParamTypes.ERR:
        return context.err;

      case ParamTypes.CONTEXT:
        return context.request.ctx;

      case ParamTypes.ENDPOINT_INFO:
        return context.request.ctx.endpoint;

      case ParamTypes.RESPONSE_DATA:
        return context.request.ctx.data;

      default:
        if (param.filter) {
          return this.getFilter(param, context);
        }

        return context.request;
    }
  }

  /**
   * Return a custom filter
   * @param param
   * @param context
   * @deprecated
   */
  getFilter(param: ParamMetadata, context: HandlerContext) {
    const {expression} = param;
    const instance = this.injector.get<IFilter>(param.filter);

    if (!instance || !instance.transform) {
      throw new UnknownFilterError(param.filter!);
    }

    return instance.transform(expression, context.request, context.response);
  }

  mapHandlerContext(metadata: HandlerMetadata, {request, response, err, next}: any): HandlerContext {
    return new HandlerContext({
      injector: this.injector,
      request,
      response,
      next,
      err,
      metadata,
      args: []
    });
  }

  createRawHandler(metadata: HandlerMetadata): Function {
    if (metadata.hasErrorParam) {
      return (err: any, request: any, response: any, next: any) =>
        this.onRequest(
          this.mapHandlerContext(metadata, {
            request,
            response,
            next,
            err
          })
        );
    } else {
      return (request: any, response: any, next: any) =>
        this.onRequest(
          this.mapHandlerContext(metadata, {
            request,
            response,
            next
          })
        );
    }
  }

  protected async onRequest(context: HandlerContext) {
    if (context.isDone) {
      return;
    }

    const {
      metadata: {parameters}
    } = context;

    try {
      context.args = await Promise.all(parameters.map(param => this.mapParam(param, context)));

      await context.callHandler();
    } catch (error) {
      context.next(error);
    }
  }

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
   * @param context
   */
  private async mapParam(metadata: ParamMetadata, context: HandlerContext) {
    const {injector} = context;
    const value = this.getParam(metadata, context);

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
