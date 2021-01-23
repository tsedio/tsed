import {$log, Controller, Get} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import {Hidden} from "@tsed/swagger";
import {Server} from "./Server";

if (process.env.NODE_ENV !== "test") {
  @Controller("/hello")
  class HelloWorld {
    @Get("/")
    get() {
      return {test: "Hello world"};
    }

    @Get("/hidden")
    @Hidden()
    getHidden() {
      return {test: "Hello world"};
    }
  }

  @Controller("/hello2")
  @Hidden()
  class HelloWorld2 {
    @Get("/")
    get() {
      return {test: "Hello world"};
    }
  }

  async function bootstrap() {
    try {
      $log.debug("Start server...");
      const platform = await PlatformExpress.bootstrap(Server, {
        mount: {"/rest": [HelloWorld, HelloWorld2]}
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
