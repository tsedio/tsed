import {HandlerMetadata, HandlerType, OnRequestOptions, PlatformHandler} from "@tsed/common";

/**
 * @platform
 * @express
 */
export class PlatformExpressHandler extends PlatformHandler {
  protected createRawHandler(metadata: HandlerMetadata): Function {
    if (metadata.type === HandlerType.ERR_MIDDLEWARE) {
      const handler = this.compileHandler(metadata);
      return async (err: any, req: any, res: any, next: any) =>
        handler({
          err,
          next,
          $ctx: req.$ctx
        });
    }

    return super.createRawHandler(metadata);
  }

  protected async onCtxRequest(requestOptions: OnRequestOptions): Promise<any> {
    try {
      return await super.onCtxRequest(requestOptions);
    } catch (er) {
      return this.onError(er, requestOptions);
    }
  }
}
