import {GlobalProviders, IDIConfigurationOptions, InjectorService} from "@tsed/di";
import {$log} from "@tsed/logger";
import {ServerSettingsService} from "../../config/services/ServerSettingsService";

$log.name = "TSED";
$log.level = "info";

export function createInjector(settings: Partial<IDIConfigurationOptions> = {}) {
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

function createSettingsService(injector: InjectorService): ServerSettingsService & TsED.Configuration {
  const provider = GlobalProviders.get(ServerSettingsService)!.clone();

  provider.instance = injector.invoke<ServerSettingsService>(provider.useClass);
  injector.addProvider(ServerSettingsService, provider);

  return provider.instance as any;
}
