import {AnyToPromise, AnyToPromiseStatus} from "@tsed/core";
import {ProviderScope} from "@tsed/di";
import {HandlerMetadata} from "./HandlerMetadata";
import {PlatformContext} from "./PlatformContext";

/**
 * @ignore
 */
export interface HandlerContextOptions {
  $ctx: PlatformContext;
  metadata: HandlerMetadata;
  args: any[];
  err?: any;
}

export class HandlerContext extends AnyToPromise {
  public metadata: HandlerMetadata;
  public $ctx: PlatformContext;
  public err: any;
  public args: any[];

  constructor({$ctx, err, metadata, args}: HandlerContextOptions) {
    super();
    this.$ctx = $ctx;

    err && (this.err = err);
    metadata && (this.metadata = metadata);
    args && (this.args = args || []);
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

      if (this.status === AnyToPromiseStatus.PENDING) {
        this.status = AnyToPromiseStatus.RESOLVED;
      }
    }

    return this.status !== AnyToPromiseStatus.PENDING;
  }

  private async getHandler() {
    const {metadata} = this;

    if (metadata.handler) {
      return metadata.handler;
    }

    const instance = await this.$ctx.injector.invoke<any>(metadata.token, this.$ctx.container);
    const handler = instance[metadata.propertyKey].bind(instance);

    if (this.metadata.scope === ProviderScope.SINGLETON) {
      metadata.handler = handler;
    }

    return handler;
  }

  /**
   *
   */
  async callHandler() {
    const handler = await this.getHandler();
    return super.call(() => handler(...this.args, this.$ctx));
  }

  resolve(response: any = {}) {
    if (this.isDone) {
      return;
    }

    const {data, status, headers} = response;

    if (status) {
      this.$ctx.response.status(status);
    }

    if (headers) {
      this.$ctx.response.setHeaders(headers);
    }

    if (data !== undefined) {
      this.$ctx.data = data;
    }

    return super.resolve(response);
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

  isCanceledResponse(process: any) {
    return process === this.$ctx.getResponse();
  }
}
