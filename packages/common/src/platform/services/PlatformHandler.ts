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
  ParamTypes,
  UnknowFilterError
} from "../../mvc";
import {HandlerContext} from "../domain/HandlerContext";

@Injectable({
  scope: ProviderScope.SINGLETON
})
export class PlatformHandler {
  constructor(private injector: InjectorService) {}

  createHandlerMetadata(obj: any | EndpointMetadata) {
    const {injector} = this;
    let options: IHandlerConstructorOptions;

    if (obj instanceof EndpointMetadata) {
      const provider = injector.getProvider(obj.target)!;

      options = {
        token: provider.provide,
        target: provider.useClass,
        type: HandlerType.CONTROLLER,
        propertyKey: obj.propertyKey
      };
    } else {
      const provider = injector.getProvider(obj);

      if (provider) {
        options = {
          token: provider.provide,
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

    if (metadata.hasErrorParam) {
      return (err: any, request: any, response: any, next: any) =>
        this.onRequest(
          new HandlerContext({
            injector: this.injector,
            request,
            response,
            next,
            err,
            metadata,
            args: []
          })
        );
    } else {
      return (request: any, response: any, next: any) =>
        this.onRequest(
          new HandlerContext({
            injector: this.injector,
            request,
            response,
            next,
            metadata,
            args: []
          })
        );
    }
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

      case ParamTypes.BODY:
        return context.request.body;

      case ParamTypes.QUERY:
        return context.request.query;

      case ParamTypes.PATH:
        return context.request.params;

      case ParamTypes.HEADER:
        return context.request.headers;

      case ParamTypes.COOKIES:
        return context.request.cookies;

      case ParamTypes.SESSION:
        return context.request.session;

      case ParamTypes.LOCALS:
        return context.response.locals;

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
      throw new UnknowFilterError(param.filter!);
    }

    return instance.transform(expression, context.request, context.response);
  }

  /**
   *
   * @param context
   */
  protected async onRequest(context: HandlerContext) {
    const {
      metadata: {parameters}
    } = context;

    try {
      context.args = parameters.map(param => this.mapParam(param, context));

      await context.callHandler();
    } catch (error) {
      context.next(error);
    }
  }

  private sortPipes(metadata: HandlerMetadata) {
    const get = (pipe: Type<any>) => {
      return this.injector.getProvider(pipe)!.priority || 0;
    };

    metadata.parameters.forEach(
      (param: ParamMetadata) => (param.pipes = param.pipes.sort((p1: Type<any>, p2: Type<any>) => (get(p1) < get(p2) ? -1 : 1)))
    );
  }

  /**
   *
   * @param param
   * @param context
   */
  private mapParam(param: ParamMetadata, context: HandlerContext) {
    const {injector} = context;
    const value = this.getParam(param, context);

    return param.pipes.reduce((value, pipe) => injector.get<IPipe>(pipe)!.transform(value, param), value);
  }
}
