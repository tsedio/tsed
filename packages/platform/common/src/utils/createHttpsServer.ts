import {Configuration, InjectorService, ProviderScope, registerProvider} from "@tsed/di";
import Https from "https";
import {PlatformApplication} from "../services/PlatformApplication";
import {HttpsServer} from "../decorators/httpsServer";
import {listenServer} from "./listenServer";

export function createHttpsServer(injector: InjectorService): void {
  injector.invoke(HttpsServer);
}

registerProvider({
  provide: HttpsServer,
  deps: [PlatformApplication, Configuration],
  scope: ProviderScope.SINGLETON,
  global: true,
  useFactory(platformApplication: PlatformApplication, settings: Configuration) {
    const options = settings.httpsOptions!;

    return Https.createServer(options, platformApplication.callback());
  }
});

export async function listenHttpsServer(injector: InjectorService) {
  const {settings} = injector;
  const server = injector.get<HttpsServer>(HttpsServer);

  if (settings.httpsPort !== false && server) {
    const {address, port} = settings.getHttpsPort();
    injector.logger.debug(`Start server on https://${address}:${port}`);

    const options = await listenServer(server, {address, port});
    settings.setHttpsPort(options);

    injector.logger.info(`Listen server on https://${options.address}:${options.port}`);
  }
}
