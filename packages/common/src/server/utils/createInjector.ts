import {GlobalProviders, InjectorService, ProviderType} from "@tsed/di";
import {$log} from "ts-log-debug";
import {ServerSettingsService} from "../../config/services/ServerSettingsService";

$log.name = "TSED";
$log.level = "info";

export function createInjector(settings: any) {
  const injector = new InjectorService();
  injector.settings = createSettingsService(injector);
  injector.logger = $log;
  injector.scopes = {
    ...(settings.scopes || {}),
    [ProviderType.CONTROLLER]: settings.controllerScope
  };

  return injector;
}

function createSettingsService(injector: InjectorService) {
  const provider = GlobalProviders.get(ServerSettingsService)!;
  const settingsService = injector.invoke<ServerSettingsService>(provider.useClass);

  injector.forkProvider(ServerSettingsService, settingsService);

  return settingsService;
}
