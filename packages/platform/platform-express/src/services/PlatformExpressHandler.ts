import {HandlerMetadata, HandlerType, OnRequestOptions, PlatformHandler, runInContext} from "@tsed/common";

/**
 * @platform
 * @express
 */
export class PlatformExpressHandler extends PlatformHandler {
  protected createRawHandler(metadata: HandlerMetadata): Function {
    if ([HandlerType.RAW_ERR_FN, HandlerType.RAW_FN].includes(metadata.type)) {
      return metadata.handler;
    }

    const handler = this.compileHandler(metadata);

    if (metadata.type === HandlerType.ERR_MIDDLEWARE) {
      const handler = this.compileHandler(metadata);
      return async (err: any, req: any, res: any, next: any) =>
        runInContext(req.$ctx, () =>
          handler({
            err,
            next,
            $ctx: req.$ctx
          })
        );
    }

    return async (req: any, res: any, next: any) => {
      return runInContext(req.$ctx, () =>
        handler({
          next,
          $ctx: req.$ctx
        })
      );
    };
  }

  protected async onCtxRequest(requestOptions: OnRequestOptions): Promise<any> {
    try {
      return await super.onCtxRequest(requestOptions);
    } catch (er) {
      return this.onError(er, requestOptions);
    }
  }
}
