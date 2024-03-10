import {PlatformContext, PlatformHandler, PlatformParamsCallback} from "@tsed/common";
import "./PlatformKoaRequest";

export class PlatformKoaHandler extends PlatformHandler {
  async onRequest(handler: PlatformParamsCallback, $ctx: PlatformContext): Promise<any> {
    if (($ctx.error instanceof Error && !$ctx.handlerMetadata.hasErrorParam) || ($ctx.handlerMetadata.hasErrorParam && !$ctx.error)) {
      return;
    }

    try {
      return await super.onRequest(handler, $ctx);
    } catch (er) {
      $ctx.error = er;
      return er;
    }
  }

  public flush($ctx: PlatformContext) {
    if (!$ctx.error && $ctx.data === undefined && $ctx.getResponse().body) {
      $ctx.data = $ctx.getResponse().body;
    }

    return super.flush($ctx);
  }
}
