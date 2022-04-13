import {InjectorService, ProviderScope} from "@tsed/di";
import {getHostInfoFromPort} from "@tsed/core";
import Http from "http";
import {listenServer} from "./listenServer";

export function createHttpServer(injector: InjectorService, requestListener: Http.RequestListener) {
  const {settings} = injector;
  const httpPort = settings.getRaw("httpPort");
  const httpOptions = settings.getRaw("httpOptions");

  const server = httpPort !== false ? Http.createServer(httpOptions, requestListener) : null;

  injector.addProvider(Http.Server, {
    scope: ProviderScope.SINGLETON,
    useValue: server
  });

  injector.invoke(Http.Server);

  if (server) {
    const hostInfo = getHostInfoFromPort("http", httpPort);

    return async () => {
      const resolvedHostInfo = await listenServer(injector, server as Http.Server, hostInfo);
      settings.setRaw("httpPort", `${resolvedHostInfo.address}:${resolvedHostInfo.port}`);
      return server;
    };
  }
}
