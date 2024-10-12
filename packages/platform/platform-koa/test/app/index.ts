import {$log, Controller} from "@tsed/platform-http";
import {Get} from "@tsed/schema";

import {PlatformKoa} from "../../src/index.js";
import {Server} from "./Server.js";

if (process.env.NODE_ENV !== "test") {
  @Controller("/hello")
  class HelloWorld {
    @Get("/")
    get() {
      return {test: "Hello world"};
    }
  }

  async function bootstrap() {
    try {
      $log.debug("Start server...");
      const platform = await PlatformKoa.bootstrap(Server, {
        disableComponentScan: true,
        mount: {
          "/rest": [HelloWorld]
        }
      });

      await platform.listen();
      $log.debug("Server initialized");
    } catch (er) {
      console.error(er);
      $log.error(er);
    }
  }

  bootstrap();
}
