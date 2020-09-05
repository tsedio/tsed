import {PlatformResponse} from "../../platform/services/PlatformResponse";

export interface OnResponse {
  $onResponse(ctx: PlatformResponse): void;
}
