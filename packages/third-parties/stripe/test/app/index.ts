import {$log} from "@tsed/logger";
import {IndexCtrl} from "./controllers/pages/IndexCtrl.js";
import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./Server.js";
import {VersionCtrl} from "./controllers/rest/VersionCtrl.js";

if (process.env.NODE_ENV !== "test") {
  async function bootstrap() {
    try {
      const platform = await PlatformExpress.bootstrap({
        rootModule: Server,
        mount: {
          "/rest": [VersionCtrl],
          "/": [IndexCtrl]
        }
      });

      await platform.listen();
      $log.debug("Server initialized");
    } catch (er) {
      console.error(er);
      $log.error(er);
    }
  }

  bootstrap();
}
