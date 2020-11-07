import {GlobalProviders, InjectorService, setLoggerLevel} from "@tsed/di";
import {$log} from "@tsed/logger";
import {PlatformConfiguration} from "../../config/services/PlatformConfiguration";

$log.name = "TSED";

export function createInjector(settings: Partial<TsED.Configuration> = {}) {
  const injector = new InjectorService();
  injector.settings = createSettingsService(injector);
  injector.logger = $log;
  injector.settings.set(settings);

  setLoggerLevel(injector);

  return injector;
}

function createSettingsService(injector: InjectorService): PlatformConfiguration & TsED.Configuration {
  const provider = GlobalProviders.get(PlatformConfiguration)!.clone();

  provider.instance = injector.invoke<PlatformConfiguration>(provider.useClass);
  injector.addProvider(PlatformConfiguration, provider);

  return provider.instance as any;
}
