import {configuration, constant, InjectorService} from "@tsed/di";
import Http from "http";
import Https from "https";

import {createServer} from "./createServer.js";

export function createHttpsServer(requestListener?: Http.RequestListener) {
  const httpsOptions = configuration().get("httpsOptions");

  return createServer({
    type: "https",
    token: Https.Server,
    port: constant("httpsPort"),
    server: () => Https.createServer(httpsOptions, requestListener)
  });
}
