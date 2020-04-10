import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./Server";

if (process.env.NODE_ENV !== "test") {
  async function bootstrap() {
    try {
      const server = await PlatformExpress.bootstrap(Server, {});
      await server.listen();
    } catch (er) {
      console.error(er);
    }
  }

  bootstrap();
}
