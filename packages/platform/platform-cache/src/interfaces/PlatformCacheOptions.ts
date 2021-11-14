import {MetadataTypes} from "@tsed/core";
import {BaseContext} from "@tsed/di";
import type {TtlFunction} from "cache-manager";

export interface PlatformCacheOptions extends MetadataTypes {
  ttl?: number | TtlFunction;
  key?: string | ((args: any[], ctx?: BaseContext) => string);
}
