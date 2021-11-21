import {GlobalProviders, InjectorService, setLoggerLevel} from "@tsed/di";
import {$log} from "@tsed/logger";
import {PlatformConfiguration} from "../config/services/PlatformConfiguration";

$log.name = "TSED";

export function createInjector(settings: Partial<TsED.Configuration> = {}) {
  const injector = new InjectorService();
  injector.addProvider(PlatformConfiguration);

  injector.settings = injector.invoke(PlatformConfiguration);
  injector.logger = $log;
  injector.settings.set(settings);

  setLoggerLevel(injector);

  return injector;
}
