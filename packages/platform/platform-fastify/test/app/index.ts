import {Controller} from "@tsed/di";
import {$log} from "@tsed/logger";
import {PathParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";

import {PlatformFastify} from "../../src/index.js";
import {Server} from "./Server.js";

if (process.env.NODE_ENV !== "test") {
  @Controller("/hello")
  class HelloWorld {
    @Get("/")
    get() {
      return {test: "Hello world"};
    }

    @Get("/:id")
    getById(@PathParams("id") id: string) {
      return {test: "Hello world", id};
    }
  }

  async function bootstrap() {
    try {
      $log.debug("Start server...");
      const platform = await PlatformFastify.bootstrap(Server, {
        disableComponentScan: true,
        mount: {
          "/rest": [HelloWorld]
        },
        swagger: [
          {
            path: "/doc"
          }
        ]
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
