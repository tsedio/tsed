import {PlatformExpress} from "@tsed/platform-express";
import {$log} from "@tsed/platform-http";

import {Server} from "./Server.js";

if (process.env.NODE_ENV !== "test") {
  async function bootstrap() {
    try {
      const platform = await PlatformExpress.bootstrap(Server, {});

      await platform.listen();
      $log.debug("Server initialized");
    } catch (er) {
      console.error(er);
      $log.error(er);
    }
  }

  bootstrap();
}
