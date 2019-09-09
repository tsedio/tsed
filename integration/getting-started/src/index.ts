import {$log, ServerLoader} from "@tsed/common";
import {Server} from "./Server";

async function bootstrap() {
  try {
    $log.debug("Start server...");
    const server = await ServerLoader.bootstrap(Server, {
      swagger: {}
    });

    await server.listen();
    $log.debug("Server initialized");
  } catch (er) {
    $log.error(er);
  }
}

bootstrap();
