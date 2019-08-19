import {InjectorService, ProviderScope, registerProvider} from "@tsed/di";
import * as Http from "http";
import {ExpressApplication} from "../decorators/expressApplication";
import {HttpServer} from "../decorators/httpServer";

export function createHttpServer(injector: InjectorService): void {
  injector.forkProvider(HttpServer);
}

registerProvider({
  provide: HttpServer,
  deps: [ExpressApplication],
  scope: ProviderScope.SINGLETON,
  global: true,
  useFactory(expressApplication: ExpressApplication) {
    return Http.createServer(expressApplication);
  }
});
