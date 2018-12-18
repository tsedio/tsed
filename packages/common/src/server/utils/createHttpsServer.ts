import * as Https from "https";
import {HttpsServer} from "../decorators/httpsServer";
import {IHTTPSServerOptions} from "../interfaces/IHTTPSServerOptions";
import {InjectorService} from "../../di/services/InjectorService";
import {ExpressApplication} from "../../mvc/decorators";

export function createHttpsServer(injector: InjectorService, options: IHTTPSServerOptions): Https.Server {
  const expressApp = injector.get<ExpressApplication>(ExpressApplication);
  const httpsServer: any = Https.createServer(options, expressApp);
  // TODO to be removed
  /* istanbul ignore next */
  httpsServer.get = () => httpsServer;

  injector.forkProvider(HttpsServer, httpsServer);

  return this;
}
