import http from "http";
import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./Server";
import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";
import {QueryParams} from "@tsed/platform-params";

@Controller("/hello")
class HelloWorld {
  @Get("/")
  get(@QueryParams("q") query: string[]) {
    return { test: "Hello world" };
  }
}

const platform = PlatformExpress.create(Server, {
  mount: { "/rest": [HelloWorld] }
});

const promise = platform.bootstrap()

const server = http.createServer(async (req, res) => {
  await promise;
  platform.callback(req, res);
});

server.listen(3002);
