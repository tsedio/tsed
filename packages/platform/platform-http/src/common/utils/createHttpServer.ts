import Http from "node:http";

import {configuration, constant} from "@tsed/di";

import {createServer} from "./createServer.js";

export function createHttpServer(requestListener: Http.RequestListener) {
  const httpOptions = configuration().get<Http.ServerOptions>("httpOptions");

  return createServer({
    port: constant<string | false>("httpPort"),
    type: "http",
    token: Http.Server,
    server: () => Http.createServer(httpOptions, requestListener)
  });
}
