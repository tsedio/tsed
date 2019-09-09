import {$log, ServerLoader} from "@tsed/common";
import {Server} from "./Server";

process.env["NODE_CONFIG_DIR"] = __dirname + "/../config";
const config = require("config");

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
