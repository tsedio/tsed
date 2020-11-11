import {Logger} from "@tsed/logger";
import {registerProvider} from "../registries/ProviderRegistry";
import {InjectorService} from "./InjectorService";

registerProvider({
  provide: Logger,
  deps: [InjectorService],
  useFactory(injector: InjectorService) {
    return injector.logger;
  }
});
