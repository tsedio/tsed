import {InjectorService, ProviderScope, registerProvider} from "@tsed/di";
import Http from "http";
import {PlatformApplication} from "../services/PlatformApplication";
import {HttpServer} from "../decorators/httpServer";
import {listenServer} from "./listenServer";

export function createHttpServer(injector: InjectorService): void {
  injector.invoke(HttpServer);
}

registerProvider({
  provide: HttpServer,
  deps: [PlatformApplication],
  scope: ProviderScope.SINGLETON,
  global: true,
  useFactory(platformApplication: PlatformApplication) {
    return Http.createServer(platformApplication.callback());
  }
});

export async function listenHttpServer(injector: InjectorService) {
  const {settings} = injector;
  const server = injector.get<HttpServer>(HttpServer);

  if (settings.httpPort !== false && server) {
    const {address, port} = settings.getHttpPort();
    injector.logger.debug(`Start server on http://${address}:${port}`);

    const options = await listenServer(server, {address, port});
    settings.setHttpPort(options);

    injector.logger.info(`Listen server on http://${options.address}:${options.port}`);
  }
}
