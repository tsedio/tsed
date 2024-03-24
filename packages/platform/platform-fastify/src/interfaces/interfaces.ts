import {Env, Type} from "@tsed/core";
import fastify from "fastify";
import {PlatformFastifySettings} from "./PlatformFastifySettings";

export * from "./PlatformFastifySettings";

export type PlatformFastifyPluginTypes = Function | /*Type<any> |*/ string;
export type PlatformFastifyPluginLoadingOptions = {env?: Env; use: PlatformFastifyPluginTypes; options?: any};
export type PlatformFastifyPluginSettings = PlatformFastifyPluginTypes | PlatformFastifyPluginLoadingOptions | any;

declare global {
  namespace TsED {
    export interface Configuration {
      /**
       * Configuration related to Koa platform application.
       */
      fastify: PlatformFastifySettings;
      plugins: PlatformFastifyPluginSettings[];
    }
  }
}
