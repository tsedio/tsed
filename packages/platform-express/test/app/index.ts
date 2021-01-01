import {$log, Controller, Get, QueryParams} from "@tsed/common";
import {PlatformExpress} from "../../src";
import {Server} from "./Server";

if (process.env.NODE_ENV !== "test") {
  @Controller("/hello")
  class HelloWorld {
    @Get("/")
    get(@QueryParams("q") query: string[]) {
      return {test: "Hello world"};
    }
  }

  async function bootstrap() {
    try {
      const platform = await PlatformExpress.bootstrap(Server, {
        mount: {"/rest": [HelloWorld]}
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
