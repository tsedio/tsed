import {PlatformAdapter, PlatformBuilder} from "@tsed/common";
import {Type} from "@tsed/core";

export interface PlatformTestOptions {
  rootDir: string;
  platform: Type<PlatformAdapter<any, any>>;
  server: Type<any>;

  [key: string]: any;
}
