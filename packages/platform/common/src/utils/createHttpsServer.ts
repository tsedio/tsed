import {InjectorService, ProviderScope} from "@tsed/di";
import {getHostInfoFromPort} from "@tsed/core";
import Https from "https";
import Http from "http";
import {listenServer} from "./listenServer";

export function createHttpsServer(injector: InjectorService, requestListener?: Http.RequestListener) {
  const {settings} = injector;
  const httpsPort = settings.getRaw("httpsPort");
  const httpsOptions = settings.getRaw("httpsOptions");

  const server = httpsPort !== false ? Https.createServer(httpsOptions, requestListener) : null;

  injector.addProvider(Https.Server, {
    scope: ProviderScope.SINGLETON,
    useValue: server
  });

  injector.invoke(Https.Server);

  if (server) {
    const hostInfo = getHostInfoFromPort("https", httpsPort);

    return async () => {
      const resolvedHostInfo = await listenServer(injector, server as Https.Server, hostInfo);
      settings.setRaw("httpsPort", `${resolvedHostInfo.address}:${resolvedHostInfo.port}`);
      return server;
    };
  }
}
