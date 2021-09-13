import {HandlerMetadata, HandlerType, OnRequestOptions, PlatformContext, PlatformHandler} from "@tsed/common";
import Koa from "koa";
import "./PlatformKoaRequest";

const OVERRIDE_TYPES = [HandlerType.ENDPOINT, HandlerType.MIDDLEWARE, HandlerType.ERR_MIDDLEWARE, HandlerType.CTX_FN];

export class PlatformKoaHandler extends PlatformHandler {
  public async flush(data: any, ctx: PlatformContext): Promise<void> {
    if (data === undefined && ctx.getResponse().body) {
      data = ctx.getResponse().body;
    }

    return super.flush(data, ctx);
  }

  protected createRawHandler(metadata: HandlerMetadata) {
    if (OVERRIDE_TYPES.includes(metadata.type)) {
      const handler = this.compileHandler(metadata);
      return async (ctx: Koa.Context, next: Koa.Next) => handler({next, $ctx: ctx.request.$ctx});
    }

    return super.createRawHandler(metadata);
  }

  protected async onRequest(requestOptions: OnRequestOptions): Promise<any> {
    const {metadata, $ctx} = requestOptions;

    if ($ctx.data instanceof Error) {
      if (metadata.hasErrorParam) {
        requestOptions.err = $ctx.data;
      } else {
        return this.onError($ctx.data, requestOptions);
      }
    }

    return super.onRequest(requestOptions);
  }

  protected onError(error: unknown, requestOptions: OnRequestOptions) {
    const {next, $ctx, metadata} = requestOptions;

    // istanbul ignore next
    if ($ctx.isDone()) {
      return;
    }

    $ctx.data = error;

    if (!next || metadata.isFinal()) {
      this.throwError(error, $ctx);

      return;
    }

    return next();
  }

  protected async onCtxRequest(requestOptions: OnRequestOptions): Promise<any> {
    const {$ctx} = requestOptions;

    try {
      return await super.onCtxRequest(requestOptions);
    } catch (error) {
      this.throwError(error, $ctx);
    }
  }

  protected throwError(error: any, $ctx: PlatformContext) {
    $ctx.getApp().emit("error", error, $ctx.getRequest().ctx);
  }
}
