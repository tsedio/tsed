import {InjectorService} from "@tsed/di";
import Http from "http";

import {createServer} from "./createServer.js";

export function createHttpServer(injector: InjectorService, requestListener: Http.RequestListener) {
  const {settings} = injector;
  const httpOptions = settings.get<Http.ServerOptions>("httpOptions");

  return createServer(injector, {
    port: settings.get("httpPort"),
    type: "http",
    token: Http.Server,
    server: () => Http.createServer(httpOptions, requestListener)
  });
}
