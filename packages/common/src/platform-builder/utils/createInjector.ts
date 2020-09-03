import {GlobalProviders, IDIConfigurationOptions, InjectorService} from "@tsed/di";
import {$log} from "@tsed/logger";
import {PlatformConfiguration} from "../../config/services/PlatformConfiguration";

$log.name = "TSED";
$log.level = "info";

export function createInjector(settings: Partial<TsED.Configuration> = {}) {
  const injector = new InjectorService();
  injector.settings = createSettingsService(injector);
  injector.logger = $log;

  // @ts-ignore
  injector.settings.set(settings);

  if (injector.settings.env === "test") {
    injector.logger.stop();
  }

  return injector;
}

function createSettingsService(injector: InjectorService): PlatformConfiguration & TsED.Configuration {
  const provider = GlobalProviders.get(PlatformConfiguration)!.clone();

  provider.instance = injector.invoke<PlatformConfiguration>(provider.useClass);
  injector.addProvider(PlatformConfiguration, provider);

  return provider.instance as any;
}
