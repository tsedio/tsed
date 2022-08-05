import {Logger} from "@tsed/common";
import {Env} from "@tsed/core";
import {Configuration, registerProvider} from "@tsed/di";
import sirv from "sirv";
import {createServer, ViteDevServer} from "vite";

import {ViteConfig} from "../interfaces/ViteConfig";

export const VITE_SERVER = Symbol.for("VITE_DEV_SERVER");
export type VITE_SERVER = ViteDevServer;

registerProvider({
  provide: VITE_SERVER,
  deps: [Configuration, Logger],
  async useAsyncFactory(settings: Configuration, logger: Logger) {
    const config = settings.get<ViteConfig>("vite", {});
    const level = settings.logger.level;

    if (settings.env !== Env.PROD) {
      logger.info("Start Vite Dev Server 🚀...");

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

    return {middlewares: sirv(`${config.root || ""}/dist/client`)};
  },
  hooks: {
    $onDestroy(viteDevServer: Partial<ViteDevServer>): Promise<any> | void {
      return viteDevServer.close && viteDevServer.close();
    }
  }
});
