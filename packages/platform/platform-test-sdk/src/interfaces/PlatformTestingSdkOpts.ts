import {PlatformAdapter} from "@tsed/common";
import {Type} from "@tsed/core";

export interface PlatformTestingSdkOpts {
  rootDir: string;
  platform: Type<PlatformAdapter<any>>;
  server: Type<any>;

  [key: string]: any;
}
