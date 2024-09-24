import {$log} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";

import {expressApp} from "./legacy/server.js";
import {Server} from "./server";

async function bootstrap() {
  try {
    $log.debug("Start server...");
    const platform = await PlatformExpress.bootstrap(Server, {
      express: {
        app: expressApp
      }
    });

    await platform.listen();
    $log.debug("Server initialized");
  } catch (er) {
    $log.error(er);
  }
}

bootstrap();
