import {isFunction, isPromise, isStream} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import {isObservable} from "rxjs";
import {HandlerMetadata} from "../../mvc/models/HandlerMetadata";
import {IHandlerContext} from "../interfaces/IHandlerContext";

const isFinish = (request: TsED.Request, response: TsED.Response) => {
  if (!response || !request) {
    return true;
  }

  return request.aborted || response.headersSent || response.writableEnded || response.writableFinished;
};

export class HandlerContext {
  public injector: InjectorService;
  public metadata: HandlerMetadata;
  public request: TsED.Request;
  public response: TsED.Response;
  public err: any;
  public args: any[];
  private _isDone: boolean = false;
  private _next: any;

  constructor({injector, request, response, next, err, metadata, args}: IHandlerContext) {
    this.injector = injector!;
    this.request = request;
    this.response = response;
    this._next = next;
    this.err = err;
    this.metadata = metadata!;
    this.args = args || [];

    this.next = this.next.bind(this);
  }

  get isDone(): boolean {
    const {response, request} = this;

    // @ts-ignore
    if (!this._isDone && (isFinish(request, response))) {
      this.destroy();
    }

    return this._isDone;
  }

  get container() {
    return this.request?.ctx?.container;
  }

  done(error: any, result?: any) {
    if (this.isDone) {
      return;
    }

    const {
      metadata: {hasNextFunction},
      request: {ctx}
    } = this;

    if (error) {
      return this.next(error);
    }

    if (!hasNextFunction) {
      if (!result !== undefined) {
        ctx.data = result;
      }
      this.next();
    }
  }

  handle(process: any) {
    if (this.isDone) {
      return;
    }

    const {
      metadata: {hasNextFunction},
      request,
      response,
      next
    } = this;

    if (process) {
      if (process === response) {
        // ABANDON
        this.destroy();

        return;
      }

      if (isObservable(process)) {
        process = process.toPromise();
      }

      if (isStream(process) || Buffer.isBuffer(process)) {
        return this.done(null, process);
      }

      if (isFunction(process)) {

        // when process return a middleware
        return process(request, response, next.bind(this));
      }

      if (isPromise(process)) {
        return process.then((result: any) => this.handle(result)).catch((error: any) => this.done(error));
      }
    }

    if (!hasNextFunction) {
      // no next function and empty response
      this.done(null, process);
    }
  }

  /**
   *
   */
  async callHandler() {
    if (this.isDone) {
      return;
    }

    const {token, propertyKey} = this.metadata;

    const instance: any = this.injector.invoke(token, this.container);
    const handler = instance[propertyKey!].bind(instance);

    await this.handle(handler(...this.args));
  }

  next(error?: any) {
    const {_next: next} = this;

    this.destroy();

    return next && next(error);
  }

  destroy() {
    delete this.request;
    delete this.response;
    delete this.args;
    delete this._next;
    delete this.metadata;
    delete this.injector;
    delete this.err;
    this._isDone = true;
  }
}
