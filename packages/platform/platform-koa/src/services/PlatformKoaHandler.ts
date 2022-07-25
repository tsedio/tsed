import {PlatformContext, PlatformHandler} from "@tsed/common";
import "./PlatformKoaRequest";

export class PlatformKoaHandler extends PlatformHandler {
  public async flush($ctx: PlatformContext) {
    if ($ctx.error) {
      throw $ctx.error;
    }

    if ($ctx.data === undefined && $ctx.getResponse().body) {
      $ctx.data = $ctx.getResponse().body;
    }

    return super.flush($ctx);
  }
}
