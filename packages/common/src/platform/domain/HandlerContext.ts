import {isObservable, isPromise, isStream} from "@tsed/core";
import {ProviderScope} from "@tsed/di";
import {HandlerMetadata} from "../../mvc/models/HandlerMetadata";
import {PlatformContext} from "./PlatformContext";

/**
 * @ignore
 */
function isResponse(obj: any) {
  return obj.data && obj.headers && obj.status && obj.statusText;
}

/**
 * @ignore
 */
export interface HandlerContextOptions {
  $ctx: PlatformContext;
  metadata: HandlerMetadata;
  args: any[];
  err?: any;
}

/**
 * @ignore
 */
export enum HandlerContextStatus {
  PENDING = "pending",
  CANCELED = "canceled",
  RESOLVED = "resolved",
  REJECTED = "rejected"
}

export class HandlerContext {
  public status = HandlerContextStatus.PENDING;
  public metadata: HandlerMetadata;
  public $ctx: PlatformContext;
  public err: any;
  public args: any[];

  #resolves: any;
  #rejects: any;

  readonly #promise: Promise<any>;

  constructor({$ctx, err, metadata, args}: HandlerContextOptions) {
    this.$ctx = $ctx;

    this.#promise = new Promise((resolve: any, reject: any) => {
      this.#resolves = resolve;
      this.#rejects = reject;
    });

    err && (this.err = err);
    metadata && (this.metadata = metadata);
    args && (this.args = args || []);

    this.next = this.next.bind(this);
  }

  get request() {
    return this.$ctx?.getRequest<TsED.Request>();
  }

  get response() {
    return this.$ctx?.getResponse<TsED.Response>();
  }

  get isDone(): boolean {
    const {$ctx} = this;
    if (!$ctx || $ctx.isDone()) {
      return true;
    }

    if ($ctx.request.isAborted() || $ctx.response.isDone()) {
      this.destroy();

      if (this.status === HandlerContextStatus.PENDING) {
        this.status = HandlerContextStatus.RESOLVED;
      }
    }

    return this.status !== HandlerContextStatus.PENDING;
  }

  private get handler() {
    const {metadata} = this;

    if (metadata.handler) {
      return metadata.handler;
    }

    if (this.metadata.scope === ProviderScope.SINGLETON) {
      if (!this.$ctx.injector.has(metadata.token)) {
        this.$ctx.injector.invoke<any>(metadata.token);
      }

      const instance = this.$ctx.injector.get(metadata.token);
      metadata.handler = instance[metadata.propertyKey].bind(instance);

      return metadata.handler;
    }

    const instance = this.$ctx.injector.invoke<any>(metadata.token, this.$ctx.container);

    return instance[metadata.propertyKey].bind(instance);
  }

  /**
   *
   */
  async callHandler() {
    if (this.isDone) {
      return this;
    }

    try {
      this.handle(this.handler(...this.args, this.$ctx));
    } catch (er) {
      this.reject(er);
    }

    return this.#promise;
  }

  reject(er: any) {
    if (this.isDone) {
      return;
    }

    this.destroy();
    this.status = HandlerContextStatus.REJECTED;
    this.#rejects(er);
  }

  resolve(data?: any) {
    if (this.isDone) {
      return;
    }

    if (this.$ctx && data !== undefined) {
      this.$ctx.data = data;
    }

    this.destroy();
    this.status = HandlerContextStatus.RESOLVED;

    this.#resolves(data);
  }

  next(error?: any) {
    if (this.isDone) {
      return;
    }

    return error ? this.reject(error) : this.resolve();
  }

  destroy() {
    // @ts-ignore
    delete this.$ctx;
    // @ts-ignore
    delete this.args;
    // @ts-ignore
    delete this.metadata;
    // @ts-ignore
    delete this.err;
  }

  cancel() {
    if (this.isDone) {
      return;
    }

    this.destroy();
    this.status = HandlerContextStatus.CANCELED;

    return this.#resolves();
  }

  handle(process: any): any {
    if (this.isDone) {
      return;
    }

    const {
      metadata: {hasNextFunction},
      $ctx
    } = this;

    if (process) {
      if (process === $ctx.getResponse()) {
        // ABANDON
        return this.cancel();
      }

      if (isObservable(process)) {
        process = process.toPromise();
      }

      if (isResponse(process)) {
        $ctx.response.setHeaders(process.headers);
        $ctx.response.status(process.status);

        return this.handle(process.data);
      }

      if (isStream(process) || Buffer.isBuffer(process)) {
        return this.resolve(process);
      }

      if (isPromise(process)) {
        return process
          .then((result: any) => this.handle(result))
          .catch((error: any) => {
            if (error.response && isResponse(error.response)) {
              return this.handle(error.response);
            }
            return this.reject(error);
          });
      }
    }

    if (!hasNextFunction) {
      // no next function and empty response
      return this.resolve(process);
    }
  }
}
