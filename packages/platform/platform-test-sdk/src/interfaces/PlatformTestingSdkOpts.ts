import {Type} from "@tsed/core";
import {PlatformAdapter} from "@tsed/platform-http";

export interface PlatformTestingSdkOpts {
  rootDir: string;
  platform: Type<PlatformAdapter<any>>;
  server: Type<any>;

  [key: string]: any;
}
