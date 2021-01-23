import {PlatformContext} from "../../platform/domain/PlatformContext";

export interface OnRequest {
  $onRequest(ctx: PlatformContext): void;
}
