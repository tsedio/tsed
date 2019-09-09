import {$log, ServerLoader} from "@tsed/common";
import {Server} from "./Server";

const config = require('dotenv').config({ path: '/full/custom/path/to/your/env/vars' });

async function bootstrap() {
  try {
    $log.debug("Start server...");
    const server = await ServerLoader.bootstrap(Server, config /* or config.util.toObject() */);

    await server.listen();
    $log.debug("Server initialized");
  } catch (er) {
    $log.error(er);
  }
}

bootstrap();
