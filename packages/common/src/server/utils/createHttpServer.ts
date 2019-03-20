import {InjectorService, ProviderScope, registerProvider} from "@tsed/di";
import * as Http from "http";
import {ExpressApplication} from "../../mvc/decorators/class/expressApplication";
import {HttpServer} from "../decorators/httpServer";
import {HttpsServer} from "../decorators/httpsServer";

export async function createHttpServer(injector: InjectorService): Promise<void> {
  await injector.forkProvider(HttpsServer);
}

registerProvider({
  provide: HttpServer,
  deps: [ExpressApplication],
  scope: ProviderScope.SINGLETON,
  buildable: false,
  global: true,
  useFactory(expressApplication: ExpressApplication) {
    return Http.createServer(expressApplication);
  }
});
