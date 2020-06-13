import {$log} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./Server";

async function bootstrap() {
  try {
    $log.debug("Start server...");
    const server = await PlatformExpress.bootstrap(Server, {});

    await server.listen();
    $log.debug("Server initialized");
  } catch (er) {
    $log.error(er);
  }
}

bootstrap();
