import {isFunction, isPromise, isStream, nameOf} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import * as Express from "express";
import {isObservable} from "rxjs";
import {FilterBuilder, IFilterPreHandler, ParamMetadata} from "../../filters";
import {HandlerType} from "../interfaces/HandlerType";
import {EndpointMetadata} from "./EndpointMetadata";
import {HandlerMetadata, IHandlerOptions} from "./HandlerMetadata";

/**
 * @stable
 */
export class HandlerBuilder {
  private filters: any[];
  private debug: boolean;
  private injector: InjectorService;

  constructor(private handlerMetadata: HandlerMetadata) {}

  /**
   *
   * @param obj
   * @returns {HandlerBuilder}
   */
  static from(obj: any | EndpointMetadata) {
    return {
      build(injector: InjectorService) {
        const handlerMetadata = HandlerBuilder.resolve(obj, injector);

        if (handlerMetadata.type === HandlerType.FUNCTION) {
          // injector.logger.debug("Return handler as function", handlerMetadata.handler.name);
          return handlerMetadata.handler;
        }

        // injector.logger.trace("Build handler", `${nameOf(handlerMetadata.target)}.${handlerMetadata.method}()`);
        return new HandlerBuilder(handlerMetadata).build(injector);
      }
    };
  }

  static resolve(obj: any | EndpointMetadata, injector: InjectorService) {
    let options: IHandlerOptions;

    if (obj instanceof EndpointMetadata) {
      const provider = injector.getProvider(obj.target)!;

      options = {
        token: provider.provide,
        target: provider.useClass,
        type: HandlerType.CONTROLLER,
        method: obj.methodClassName
      };
    } else {
      const provider = injector.getProvider(obj);

      if (provider) {
        options = {
          token: provider.provide,
          target: provider.useClass,
          type: HandlerType.MIDDLEWARE,
          method: "use"
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

  static handle(process: any, {request, response, next, hasNextFunction}: any) {
    const done = (error: any, result?: any) => {
      if (error) {
        return next(error);
      }

      if (!hasNextFunction) {
        if (!next.isCalled && result !== undefined) {
          request.ctx.data = result;
        }
        next();
      }
    };

    if (process) {
      if (process === response) {
        return;
      }

      if (isObservable(process)) {
        // TODO basic support
        process = process.toPromise();
      }

      if (isStream(process)) {
        return done(null, process);
      }

      if (isFunction(process)) {
        // when process return a middleware
        return process(request, response, next);
      }

      if (isPromise(process)) {
        return process
          .then((result: any) =>
            this.handle(result, {
              request,
              response,
              next,
              hasNextFunction
            })
          )
          .catch((error: any) => done(error));
      }
    }

    if (!hasNextFunction) {
      // no next function and empty response
      done(null, process);
    }
  }

  /**
   *
   * @returns {any}
   */
  public build(injector: InjectorService) {
    const {services, hasErrorParam} = this.handlerMetadata;
    this.injector = injector;
    this.debug = injector.settings.debug;
    this.filters = services.map((param: ParamMetadata) => new FilterBuilder(injector).build(param));

    if (hasErrorParam) {
      return (err: any, request: any, response: any, next: any) => this.invoke(request, response, next, err);
    } else {
      return (request: any, response: any, next: any) => this.invoke(request, response, next);
    }
  }

  /**
   *
   */
  private getHandler(locals: Map<string | Function, any>): Function {
    const {token, method} = this.handlerMetadata;

    // Considering the injector.invoke return always a promise
    const instance: any = /* await */ this.injector.invoke(token, locals);

    return instance[method!].bind(instance);

    // const {token, method} = this.handlerMetadata;
    // const provider = this.injector.getProvider(token);
    //
    // /* istanbul ignore next */
    // if (!provider) {
    //   throw new Error(`${nameOf(token)} component not found in the injector`);
    // }
    //
    // let instance: any;
    //
    // if (provider.scope !== ProviderScope.SINGLETON) {
    //   instance = this.injector.invoke<any>(provider.useClass, locals, undefined, true);
    //   locals.set(token, instance);
    // } else {
    //   instance = this.injector.get<any>(token);
    // }
    //
    // return instance[method!].bind(instance);
  }

  /**
   *
   * @returns {Promise<any>}
   * @param request
   * @param response
   * @param next
   * @param err
   */
  private async invoke(request: Express.Request, response: Express.Response, next: any, err?: any): Promise<any> {
    const {hasNextFunction} = this.handlerMetadata;
    const {
      ctx: {container}
    } = request;

    next = this.buildNext(request, response, next);

    try {
      this.log(request, {event: "invoke.start"});
      const args = this.runFilters(request, response, next, err);
      const process = this.getHandler(container)(...args);

      HandlerBuilder.handle(process, {request, response, next, hasNextFunction});
    } catch (error) {
      next(error);
    }
  }

  /**
   *
   * @param {Express.Request} request
   * @param o
   * @returns {string}
   */
  private log(request: Express.Request, o: any = {}) {
    if (request.log && this.debug) {
      const {target, injectable, method} = this.handlerMetadata;

      request.log.debug(
        {
          type: this.handlerMetadata.type,
          target: (target ? nameOf(target) : target.name) || "anonymous",
          methodName: method,
          injectable,
          data: request.ctx.data,
          ...o
        },
        false
      );
    }
  }

  /**
   *
   * @param {Express.Request} request
   * @param {Express.Response} response
   * @param {Express.NextFunction} next
   * @returns {any}
   */
  private buildNext(request: Express.Request, response: Express.Response, next: any): any {
    next.isCalled = false;
    const dateTime = Date.now();

    return (error?: any) => {
      next.isCalled = true;
      if (response.headersSent) {
        return;
      }

      /* istanbul ignore else */
      this.log(request, {event: "invoke.end", error, execTime: Date.now() - dateTime});

      return next(error);
    };
  }

  /**
   *
   * @param request
   * @param response
   * @param next
   * @param err
   */
  private runFilters(request: Express.Request, response: Express.Response, next: Express.NextFunction, err: any) {
    return this.filters.map((filter: IFilterPreHandler) => {
      return filter({
        request,
        response,
        next,
        err
      });
    });
  }
}
