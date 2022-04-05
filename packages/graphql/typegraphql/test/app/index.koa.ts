import {$log} from "@tsed/common";
import {PlatformKoa} from "@tsed/platform-koa";
import {Server} from "./Server";

if (process.env.NODE_ENV !== "test") {
  async function bootstrap() {
    try {
      const platform = await PlatformKoa.bootstrap(Server);

      await platform.listen();
      $log.debug("Server initialized");
    } catch (er) {
      console.error(er);
      $log.error(er);
    }
  }

  bootstrap();
}
