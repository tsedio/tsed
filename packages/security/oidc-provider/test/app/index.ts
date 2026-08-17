import {$log} from "@tsed/logger";
import {IndexCtrl} from "./controllers/pages/IndexCtrl.js";
import {InteractionsCtrl} from "./controllers/oidc/InteractionsCtrl.js";
import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./Server.js";
import {VersionCtrl} from "./controllers/rest/VersionCtrl.js";

if (process.env.NODE_ENV !== "test") {
  async function bootstrap() {
    try {
      const platform = await PlatformExpress.bootstrap(Server, {
        rootModule: Server,
        mount: {
          "/rest": [VersionCtrl],
          "/": [IndexCtrl, InteractionsCtrl]
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
