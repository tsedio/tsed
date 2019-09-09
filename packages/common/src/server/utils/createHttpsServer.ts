import {Configuration, InjectorService, ProviderScope, registerProvider} from "@tsed/di";
import * as Https from "https";
import {ExpressApplication} from "../decorators/expressApplication";
import {HttpsServer} from "../decorators/httpsServer";

export function createHttpsServer(injector: InjectorService): void {
  injector.forkProvider(HttpsServer);
}

registerProvider({
  provide: HttpsServer,
  deps: [ExpressApplication, Configuration],
  scope: ProviderScope.SINGLETON,
  global: true,
  useFactory(expressApplication: ExpressApplication, settings: Configuration) {
    const options = settings.httpsOptions!;

    return Https.createServer(options, expressApplication);
  }
});
