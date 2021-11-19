import {$log} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./Server";

if (process.env.NODE_ENV !== "test") {
  async function bootstrap() {
    try {
      const platform = await PlatformExpress.bootstrap(Server, {
        disableComponentScan: true
      });
      await platform.listen();
      $log.debug("Server initialized");
    } catch (er) {
      $log.error(er);
    }
  }

  bootstrap();
}
