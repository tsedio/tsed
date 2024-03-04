import {PlatformContext, PlatformHandler, PlatformParamsCallback} from "@tsed/common";
import "./PlatformKoaRequest";
import {catchAsyncError} from "@tsed/core";

export class PlatformKoaHandler extends PlatformHandler {
  onRequest(handler: PlatformParamsCallback, $ctx: PlatformContext): Promise<any> {
    return catchAsyncError(() => {
      if (($ctx.error instanceof Error && !$ctx.handlerMetadata.hasErrorParam) || ($ctx.handlerMetadata.hasErrorParam && !$ctx.error)) {
        return;
      }

      return super.onRequest(handler, $ctx);
    });
  }

  public flush($ctx: PlatformContext) {
    if (!$ctx.error && $ctx.data === undefined && $ctx.getResponse().body) {
      $ctx.data = $ctx.getResponse().body;
    }

    return super.flush($ctx);
  }
}
