import {DIContextOptions} from "@tsed/di";

export interface PlatformContextOpts<Payload = any> extends DIContextOptions {
  url?: string;
  body?: Payload;
  headers?: Record<string, string>;
  method?: string;
  protocol?: string;
  secure?: boolean;
  query?: Record<string, string>;
  params?: Record<string, string>;
}
