import * as Http from "http";
import {InjectorService} from "@tsed/di";
import {HttpServer} from "../decorators/httpServer";
import {ExpressApplication} from "../../mvc/decorators/class/expressApplication";

export function createHttpServer(injector: InjectorService): Http.Server {
  const expressApp = injector.get<ExpressApplication>(ExpressApplication);
  const httpServer = Http.createServer(expressApp);
  // TODO to be removed
  /* istanbul ignore next */
  (httpServer as any).get = () => httpServer;

  injector.forkProvider(HttpServer, httpServer);

  return httpServer;
}
