import {$log} from "@tsed/common";
import {PlatformKoa} from "@tsed/platform-koa";
import {Server} from "./Server";
import compress from "koa-compress";
import bodyParser from "koa-bodyparser";
import methodOverride from "method-override";

if (process.env.NODE_ENV !== "test") {
  async function bootstrap() {
    try {
      const platform = await PlatformKoa.bootstrap(Server, {
        middlewares: [compress(), methodOverride(), bodyParser()]
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
