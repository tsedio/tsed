import {InjectorService, ProviderScope, registerProvider} from "@tsed/di";
import * as Https from "https";
import {ServerSettingsService} from "../../config";
import {ExpressApplication} from "../../mvc/decorators";
import {HttpsServer} from "../decorators/httpsServer";

export async function createHttpsServer(injector: InjectorService): Promise<void> {
  await injector.forkProvider(HttpsServer);
}

registerProvider({
  provide: HttpsServer,
  deps: [ExpressApplication, ServerSettingsService],
  scope: ProviderScope.SINGLETON,
  buildable: false,
  global: true,
  useFactory(expressApplication: ExpressApplication, serverSettingsService: ServerSettingsService) {
    const options = serverSettingsService.httpsOptions;

    return Https.createServer(options, expressApplication);
  }
});
