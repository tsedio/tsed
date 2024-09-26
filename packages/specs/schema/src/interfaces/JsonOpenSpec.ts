import type {OS3Header} from "@tsed/openspec";

export interface JsonHeader extends OS3Header {}

export interface JsonHeaders {
  [key: string]: number | string | (JsonHeader & {type?: string; value?: string | number});
}
