import {InjectorService, ProviderScope, registerProvider} from "@tsed/di";
import {PlatformApplication} from "../../platform/services/PlatformApplication";
import {ExpressApplication} from "../decorators/expressApplication";

export function createExpressApplication(injector: InjectorService): void {
  injector.forkProvider(ExpressApplication);
}

registerProvider({
  provide: ExpressApplication,
  deps: [PlatformApplication],
  scope: ProviderScope.SINGLETON,
  global: true,
  useFactory(platformApplication: PlatformApplication) {
    return platformApplication.raw;
  },
});
