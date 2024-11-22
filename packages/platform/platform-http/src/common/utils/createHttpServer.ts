import {configuration, constant} from "@tsed/di";
import Http from "http";

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
