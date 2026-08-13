import {$log} from "@tsed/logger";
import {PlatformExpress} from "@tsed/platform-express";
import dotenv from "dotenv";
import {Server} from "./Server.js";

dotenv.config({path: "/full/custom/path/to/your/env/vars"});

async function bootstrap() {
  try {
    $log.debug("Start server...");
    const platform = await PlatformExpress.bootstrap({
      rootModule: Server,
      envs: process.env
    });

    await platform.listen();
    $log.debug("Server initialized");
  } catch (er) {
    $log.error(er);
  }
}

bootstrap();
