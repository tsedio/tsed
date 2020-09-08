import {HandlerMetadata, HandlerType, PlatformHandler} from "@tsed/common";

/**
 * @platform
 * @express
 */
export class PlatformExpressHandler extends PlatformHandler {
  protected createRawHandler(metadata: HandlerMetadata): Function {
    switch (metadata.type) {
      default:
      case HandlerType.FUNCTION:
        return metadata.handler;

      case HandlerType.$CTX:
        return async (req: any, res: any, next: any) => {
          await metadata.handler(req.$ctx);

          return next();
        };

      case HandlerType.CONTROLLER:
      case HandlerType.MIDDLEWARE:
        if (metadata.hasErrorParam) {
          return (err: any, request: any, response: any, next: any) =>
            this.onRequest({
              err,
              $ctx: request.$ctx,
              next,
              metadata
            });
        }

        return (request: any, response: any, next: any) => this.onRequest({$ctx: request.$ctx, next, metadata});
    }
  }
}
