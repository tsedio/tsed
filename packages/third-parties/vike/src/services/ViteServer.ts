import {Configuration, registerProvider} from "@tsed/di";
import type {InlineConfig, ViteDevServer} from "vite";
import {Env} from "@tsed/core";
import {Logger} from "@tsed/logger";
import {ViteConfig} from "../interfaces/ViteConfig.js";

export const VITE_SERVER = Symbol.for("VITE_DEV_SERVER");
export type VITE_SERVER = ViteDevServer;

registerProvider({
  token: VITE_SERVER,
  deps: [Configuration, Logger],
  async useAsyncFactory(settings: Configuration, logger: Logger) {
    const {enableStream, statics: staticsOpts = {}, ...config} = settings.get<ViteConfig & InlineConfig>("vite", {});
    const level = settings.logger.level;

    if (settings.env !== Env.PROD) {
      logger.info("Start Vite Dev Server 🚀...");
      // @ts-ignore
      const {createServer} = await import("vite");

      return createServer({
        ...config,
        server: {
          ...(config?.server || {}),
          middlewareMode: true
        },
        logLevel: String(config.logLevel || level) as any
      });
    }

    logger.info("Initialize statics vite application");
    const {default: sirv} = await import("sirv");

    return Promise.resolve({
      middlewares: sirv(`${config.root || ""}/dist/client`, {
        dotfiles: false,
        ...staticsOpts,
        dev: false
      })
    });
  },
  hooks: {
    $onDestroy(viteDevServer: Partial<ViteDevServer>): Promise<any> | void {
      return viteDevServer.close && viteDevServer.close();
    }
  }
});
