import {$log} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import {InteractionsCtrl} from "./controllers/oidc/InteractionsCtrl";
import {IndexCtrl} from "./controllers/pages/IndexCtrl";
import {VersionCtrl} from "./controllers/rest/VersionCtrl";
import {Server} from "./Server";

if (process.env.NODE_ENV !== "test") {
  async function bootstrap() {
    try {
      const platform = await PlatformExpress.bootstrap(Server, {
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
