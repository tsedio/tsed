import {PlatformResponse} from "../services/PlatformResponse";

export interface OnResponse {
  $onResponse(ctx: PlatformResponse): void;
}
