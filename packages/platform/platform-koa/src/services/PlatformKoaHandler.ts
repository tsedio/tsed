import "./PlatformKoaRequest.js";

import type {PlatformContext, PlatformParamsCallback} from "@tsed/common";
import {PlatformHandler} from "@tsed/common";

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
