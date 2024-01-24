import {Logger} from "@tsed/common";
import {Env} from "@tsed/core";
import {Configuration, registerProvider} from "@tsed/di";

// @ts-ignore
import type {ViteDevServer} from "vite";

import {VikeConfig} from "../interfaces/VikeConfig";

export const VIKE_SERVER = Symbol.for("VIKE_DEV_SERVER");
export type VIKE_SERVER = ViteDevServer;

registerProvider({
  provide: VIKE_SERVER,
  deps: [Configuration, Logger],
  async useAsyncFactory(settings: Configuration, logger: Logger) {
    const {enableStream, statics: staticsOpts = {}, ...config} = settings.get<VikeConfig>("vike", {});
    const level = settings.logger.level;

    if (settings.env !== Env.PROD) {
      logger.info("Start Vike Dev Server 🚀...");
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

    logger.info("Initialize statics vike application");
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
    $onDestroy(vikeDevServer: any /*Partial<ViteDevServer>*/): Promise<any> | void {
      return vikeDevServer.close && vikeDevServer.close();
    }
  }
});
