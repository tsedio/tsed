import {PlatformContext} from "../../platform/domain/PlatformContext";

export interface OnRequest {
  $onResponse(ctx: PlatformContext): void;
}
