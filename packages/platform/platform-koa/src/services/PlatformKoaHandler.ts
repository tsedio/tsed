import {OnRequestOptions, PlatformContext, PlatformHandler} from "@tsed/common";
import "./PlatformKoaRequest";

export class PlatformKoaHandler extends PlatformHandler {
  public async flush(data: any, ctx: PlatformContext): Promise<void> {
    if (data === undefined && ctx.getResponse().body) {
      data = ctx.getResponse().body;
    }

    return super.flush(data, ctx);
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
      await requestOptions.handler(requestOptions);
      return this.next(requestOptions);
    } catch (error) {
      this.throwError(error, $ctx);
    }
  }

  protected throwError(error: any, $ctx: PlatformContext) {
    $ctx.getApp().emit("error", error, $ctx.getRequest().ctx);
  }
}
