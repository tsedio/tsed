import type {PlatformAdapter} from "@tsed/common";
import type {Type} from "@tsed/core";

export interface PlatformTestingSdkOpts {
  rootDir: string;
  platform: Type<PlatformAdapter<any>>;
  server: Type<any>;

  [key: string]: any;
}
