import {$log, BodyParams, Controller, PlatformResponse, QueryParams, Res} from "@tsed/platform-http";
import {Get, Post, Returns} from "@tsed/schema";
import {agent, SuperAgentStatic} from "superagent";
import {promisify} from "util";

import {PlatformExpress} from "../../src/index.js";
import {Server} from "./Server.js";

if (process.env.NODE_ENV !== "test") {
  @Controller("/hello")
  class HelloWorld {
    @Get("/")
    get(@QueryParams("q") query: string[]) {
      return {test: "Hello world"};
    }

    @Get("/something")
    @Returns(204)
    public async getSomething(): Promise<void> {
      await promisify(setTimeout)(10000);
    }

    @Get("/image")
    @(Returns(200).Header("X-Content-Type-Options", "nosniff"))
    async getGoogle(@Res() res: PlatformResponse) {
      const http: SuperAgentStatic = agent();

      const image_res = await http.get("https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png");

      res.setHeader("Content-Disposition", "inline;filename=googlelogo_color_272x92dp.png;");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Content-Type", "image/png");

      // res.raw.send(image_res.body); // Works
      return image_res.body; // Does not work
    }

    @Post("/")
    @Returns(200)
    postPayload(@BodyParams() body: any[]) {
      return {body};
    }
  }

  async function bootstrap() {
    try {
      const platform = await PlatformExpress.bootstrap(Server, {
        disableComponentScan: true,
        logger: {
          perf: false
        },
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
