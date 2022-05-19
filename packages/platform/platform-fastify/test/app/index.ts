import {$log, Controller, Get, PathParams} from "@tsed/common";
import {PlatformFastify} from "../../src/index";
import {Server} from "./Server";

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
