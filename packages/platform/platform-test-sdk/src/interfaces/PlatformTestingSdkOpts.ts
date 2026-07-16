import {PlatformAdapter} from "@tsed/platform-http";
import {Type} from "@tsed/core";

export interface PlatformTestingSdkOpts {
  rootDir: string;
  adapter: Type<PlatformAdapter<any>>;
  server: Type<any>;

  [key: string]: any;
}
