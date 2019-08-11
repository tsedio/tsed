import {InjectorService, ProviderScope, registerProvider} from "@tsed/di";
import * as Https from "https";
import {ServerSettingsService} from "../../config";
import {ExpressApplication} from "../decorators/expressApplication";
import {HttpsServer} from "../decorators/httpsServer";

export function createHttpsServer(injector: InjectorService): void {
  injector.forkProvider(HttpsServer);
}

registerProvider({
  provide: HttpsServer,
  deps: [ExpressApplication, ServerSettingsService],
  scope: ProviderScope.SINGLETON,
  global: true,
  useFactory(expressApplication: ExpressApplication, settings: ServerSettingsService) {
    const options = settings.httpsOptions;

    return Https.createServer(options, expressApplication);
  }
});
