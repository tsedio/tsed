import {ServerLoader} from "@tsed/common";
import {Server} from "./Server";

async function bootstrap() {
  const server = await ServerLoader.bootstrap(Server);

  return server.listen();
}

bootstrap();
