import {isFunction, isPromise, isStream, nameOf} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import {isObservable, Observable, Subject, zip} from "rxjs";
import {map} from "rxjs/operators";
import {HandlerType} from "../interfaces/HandlerType";
import {IHandlerContext} from "../interfaces/IHandlerContext";
import {EndpointMetadata} from "../models/EndpointMetadata";
import {HandlerMetadata, IHandlerConstructorOptions} from "../models/HandlerMetadata";
import {ParamMetadata} from "../models/ParamMetadata";
import {ParamBuilder} from "./ParamBuilder";

/**
 * @stable
 */
export class HandlerBuilder {
  private debug: boolean;

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

  static handle(process: any, context: IHandlerContext) {
    const {
      handler: {hasNextFunction},
      request,
      response,
      next
    } = context;

    const done = (error: any, result?: any) => {
      if (error) {
        return next(error);
      }

      if (!hasNextFunction) {
        // @ts-ignore
        if (!next.isCalled && result !== undefined) {
          request.ctx.data = result;
        }
        next();
      }
    };

    if (process) {
      if (process === context.response) {
        return;
      }

      if (isObservable(process)) {
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
        return process.then((result: any) => this.handle(result, context)).catch((error: any) => done(error));
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
  public build(injector: InjectorService): any {
    const {hasErrorParam} = this.handlerMetadata;

    this.debug = injector.settings.debug;

    const dispatch = this.createDispatcher(injector);

    if (hasErrorParam) {
      return (err: any, request: any, response: any, next: any) =>
        dispatch({
          request,
          response,
          next,
          err,
          handler: this.handlerMetadata,
          args: []
        });
    } else {
      return (request: any, response: any, next: any) =>
        dispatch({
          request,
          response,
          next,
          handler: this.handlerMetadata,
          args: []
        });
    }
  }

  private createDispatcher(injector: InjectorService) {
    const {
      handlerMetadata: {parameters}
    } = this;
    const requestSubject = new Subject<IHandlerContext>();
    const sources: Subject<IHandlerContext>[] = [requestSubject];
    const observables: Observable<any>[] = [requestSubject];

    // Build parameters
    parameters.forEach((param: ParamMetadata) => {
      const {subject, observable} = new ParamBuilder(param).build(injector);
      sources.push(subject);
      observables.push(observable);
    });

    const mapContext = map(([context, ...args]) => {
      context.args = args;
      context.next = this.buildNext(context);

      return context;
    });

    zip(...observables)
      .pipe(mapContext)
      .subscribe(context => this.invoke(injector, context));

    // Return dispatcher
    return (context: IHandlerContext) => {
      this.log(context, {event: "invoke.start"});

      sources.forEach(source => {
        source.next(context);
      });
    };
  }

  /**
   *
   * @returns {Promise<any>}
   * @param injector
   * @param context
   */
  private invoke(injector: InjectorService, context: IHandlerContext) {
    try {
      const {token, method} = this.handlerMetadata;

      this.checkContext(context);

      const instance: any = injector.invoke(token, context.request.ctx.container);
      const handler = instance[method!].bind(instance);
      const process = handler(...context.args);

      HandlerBuilder.handle(process, context);
    } catch (error) {
      context.next(error);
    }
  }

  /**
   *
   * @param context
   * @param o
   * @returns {string}
   */
  private log(context: IHandlerContext, o: any = {}) {
    const {request} = context;

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

  private checkContext(context: IHandlerContext) {
    const error = context.args.find(arg => arg instanceof Error && arg !== context.err);

    if (error) {
      throw error;
    }
  }

  /**
   *
   * @returns {any}
   * @param context
   */
  private buildNext(context: IHandlerContext): any {
    // @ts-ignore
    const next = context.next as any;
    const dateTime = Date.now();

    next.isCalled = false;

    return (error?: any) => {
      next.isCalled = true;
      if (context.response.headersSent) {
        return;
      }

      /* istanbul ignore else */
      this.log(context, {event: "invoke.end", error, execTime: Date.now() - dateTime});

      return next(error);
    };
  }
}
