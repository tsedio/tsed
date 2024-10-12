import {PlatformContext} from "../domain/PlatformContext.js";

export interface OnRequest {
  $onRequest(ctx: PlatformContext): void;
}
