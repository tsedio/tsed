import {Type} from "@tsed/core";
import {PlatformAdapter} from "@tsed/platform-http";

export interface PlatformTestingSdkOpts {
  rootDir: string;
  adapter: Type<PlatformAdapter<any>>;
  server: Type<any>;

  [key: string]: any;
}
