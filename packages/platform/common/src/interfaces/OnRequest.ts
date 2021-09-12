import {PlatformContext} from "../domain/PlatformContext";

export interface OnRequest {
  $onRequest(ctx: PlatformContext): void;
}
