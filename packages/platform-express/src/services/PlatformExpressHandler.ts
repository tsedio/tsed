import {HandlerMetadata, HandlerType, OnRequestOptions, PlatformHandler} from "@tsed/common";

/**
 * @platform
 * @express
 */
export class PlatformExpressHandler extends PlatformHandler {
  protected createRawHandler(metadata: HandlerMetadata): Function {
    switch (metadata.type) {
      default:
        return super.createRawHandler(metadata);

      case HandlerType.CTX_FN:
        return async (req: any, res: any, next: any) => {
          await this.onCtxRequest({
            metadata,
            next,
            $ctx: req.$ctx
          });
        };

      case HandlerType.ERR_MIDDLEWARE:
        return (err: any, request: any, response: any, next: any) =>
          this.onRequest({
            err,
            $ctx: request.$ctx,
            next,
            metadata
          });
    }
  }

  protected async onCtxRequest(requestOptions: OnRequestOptions): Promise<any> {
    try {
      return await super.onCtxRequest(requestOptions);
    } catch (er) {
      return this.onError(er, requestOptions);
    }
  }
}
