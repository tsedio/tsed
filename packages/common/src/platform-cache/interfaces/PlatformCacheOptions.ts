import {MetadataTypes} from "@tsed/core";
import {TtlFunction} from "cache-manager";
import {PlatformContext} from "../../platform/domain/PlatformContext";

export interface PlatformCacheOptions extends MetadataTypes {
  ttl?: number | TtlFunction;
  key?: string | ((args: any[], ctx?: PlatformContext) => string);
}
