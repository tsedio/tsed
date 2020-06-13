import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./Server";
import {PlatformExpress} from "@tsed/platform-express";

if (process.env.NODE_ENV !== "test") {
  async function bootstrap() {
    try {
      const platform = await PlatformExpress.bootstrap(Server);
      await platform.listen();
    } catch (er) {
      console.error(er);
    }
  }

  bootstrap();
}
