import {PlatformResponse} from "../services/PlatformResponse.js";

export interface OnResponse {
  $onResponse(ctx: PlatformResponse): void;
}
