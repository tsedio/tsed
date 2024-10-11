import "./PlatformKoaRequest.js";

import {PlatformContext, PlatformHandler} from "@tsed/platform-http";
import {PlatformParamsCallback} from "@tsed/platform-params";

export class PlatformKoaHandler extends PlatformHandler {
  onRequest(handler: PlatformParamsCallback, $ctx: PlatformContext) {
    if (!(($ctx.error instanceof Error && !$ctx.handlerMetadata.hasErrorParam) || ($ctx.handlerMetadata.hasErrorParam && !$ctx.error))) {
      return super.onRequest(handler, $ctx);
    }

    return Promise.resolve();
  }

  public flush($ctx: PlatformContext) {
    if (!$ctx.error && $ctx.data === undefined && $ctx.getResponse().body) {
      $ctx.data = $ctx.getResponse().body;
    }

    return super.flush($ctx);
  }
}
