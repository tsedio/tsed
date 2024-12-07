import type {Env} from "@tsed/core";
import type {FastifyPluginOptions, FastifyRegisterOptions} from "fastify";

import type {PlatformFastifySettings} from "./PlatformFastifySettings.js";

export * from "./PlatformFastifySettings.js";

export type PlatformFastifyPluginTypes = ((opts?: any) => any) | /*Type<any> |*/ string;
export type PlatformFastifyPluginLoadingOptions = {
  env?: Env;
  use: PlatformFastifyPluginTypes;
  options?: FastifyRegisterOptions<FastifyPluginOptions>;
};
export type PlatformFastifyPluginSettings = PlatformFastifyPluginTypes | PlatformFastifyPluginLoadingOptions | any;

declare global {
  namespace TsED {
    export interface Configuration {
      /**
       * Configuration related to Fastify platform application.
       */
      fastify: PlatformFastifySettings;
      plugins: PlatformFastifyPluginSettings[];
    }
  }
}
