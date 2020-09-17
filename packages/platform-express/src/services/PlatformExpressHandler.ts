import {HandlerMetadata, HandlerType, PlatformHandler} from "@tsed/common";

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
          await metadata.handler(req.$ctx);

          return !res.headersSent && next && next();
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
}
