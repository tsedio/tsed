import {$log} from "@tsed/logger";
import {PlatformExpress} from "@tsed/platform-express";

import {Server} from "./Server.js";

async function bootstrap() {
  for (let i = 0; i < 10000; i++) {
    try {
      const platform = await PlatformExpress.bootstrap(Server);
      await platform.listen();

      process.on("SIGINT", () => {
        platform.stop();
      });

      await platform.stop();
    } catch (error) {
      $log.error({event: "SERVER_BOOTSTRAP_ERROR", error});
    }
  }
}

bootstrap();
