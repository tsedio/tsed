import {ServerLoader} from "@tsed/common";
import {Server} from "./Server";

if (process.env.NODE_ENV !== "test") {
  async function bootstrap() {
    try {
      const server = await ServerLoader.bootstrap(Server);
      await server.listen();
    } catch (er) {
      console.error(er);
    }
  }

  bootstrap();
}
