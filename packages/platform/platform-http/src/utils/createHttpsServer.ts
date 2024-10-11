import {InjectorService} from "@tsed/di";
import Http from "http";
import Https from "https";

import {createServer} from "./createServer.js";

export function createHttpsServer(injector: InjectorService, requestListener?: Http.RequestListener) {
  const {settings} = injector;
  const httpsOptions = settings.get("httpsOptions");

  return createServer(injector, {
    type: "https",
    token: Https.Server,
    port: settings.get("httpsPort"),
    server: () => Https.createServer(httpsOptions, requestListener)
  });
}
