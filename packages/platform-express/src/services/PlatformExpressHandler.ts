import {HandlerContext, HandlerMetadata, HandlerType, PlatformHandler} from "@tsed/common";

/**
 * @platform
 * @express
 */
export class PlatformExpressHandler extends PlatformHandler {
  protected onError(error: unknown, h: HandlerContext) {
    return h.next(error);
  }

  protected createRawHandler(metadata: HandlerMetadata): Function {
    switch (metadata.type) {
      default:
      case HandlerType.FUNCTION:
        return metadata.handler;

      case HandlerType.$CTX:
        return async (req: any, res: any, next: any) => {
          await metadata.handler(req.$ctx);
          next();
        };

      case HandlerType.CONTROLLER:
      case HandlerType.MIDDLEWARE:
        if (metadata.hasErrorParam) {
          return (err: any, request: any, response: any, next: any) =>
            this.onRequest(
              this.mapHandlerContext(metadata, {
                request,
                response,
                next,
                err
              })
            );
        }

        return (request: any, response: any, next: any) =>
          this.onRequest(
            this.mapHandlerContext(metadata, {
              request,
              response,
              next
            })
          );
    }
  }

  private mapHandlerContext(metadata: HandlerMetadata, {request, response, err, next}: any): HandlerContext {
    return new HandlerContext({
      injector: this.injector,
      request,
      response,
      res: response,
      req: request,
      next,
      err,
      metadata,
      args: []
    });
  }
}
