import {PlatformContext, PlatformHandler, PlatformParamsCallback} from "@tsed/common";
import {isStream} from "@tsed/core";
import "./PlatformKoaRequest";

export class PlatformKoaHandler extends PlatformHandler {
  public async flush($ctx: PlatformContext) {
    if ($ctx.data === undefined && $ctx.getResponse().body) {
      $ctx.data = $ctx.getResponse().body;
    }

    return super.flush($ctx);
  }

  async onRequest(handler: PlatformParamsCallback, $ctx: PlatformContext): Promise<any> {
    if ($ctx.error instanceof Error && !$ctx.handlerMetadata.hasErrorParam) {
      return;
    }

    return super.onRequest(handler, $ctx);
  }

  public next(error: unknown, next: any, $ctx: PlatformContext) {
    if (isStream($ctx.data) || $ctx.isDone()) {
      return;
    }

    if (error && !($ctx.handlerMetadata.isEndpoint() && !$ctx.handlerMetadata.isFinal())) {
      throw error;
    }

    return !$ctx.handlerMetadata.isFinal() && next();
  }
}
