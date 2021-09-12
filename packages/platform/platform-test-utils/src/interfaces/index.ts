import {PlatformBuilder} from "@tsed/common";
import {Type} from "@tsed/core";

export interface PlatformTestOptions {
  rootDir: string;
  platform: Type<PlatformBuilder>;
  server: Type<any>;

  [key: string]: any;
}
