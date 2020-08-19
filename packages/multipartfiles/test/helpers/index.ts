import {Server} from "./Server";
import {PlatformExpress} from "@tsed/platform-express";

async function bootstrap() {
  const server = await PlatformExpress.bootstrap(Server);

  return server.listen();
}

bootstrap();
