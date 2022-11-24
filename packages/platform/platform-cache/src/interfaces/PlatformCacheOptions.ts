import {MetadataTypes} from "@tsed/core";
import {BaseContext} from "@tsed/di";
import type {Ttl} from "../services/PlatformCache";

export interface PlatformCacheOptions extends MetadataTypes {
  ttl?: Ttl;
  key?: string | ((args: any[], ctx?: BaseContext) => string);
  refreshThreshold?: number;
  canCache?: ((item: any) => boolean) | "no-nullish";
}
