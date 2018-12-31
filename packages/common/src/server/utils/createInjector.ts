import {InjectorService, GlobalProviders, ProviderType} from "@tsed/di";
import {ServerSettingsService} from "../../config/services/ServerSettingsService";

export function createInjector(settings: any) {
  const injector = new InjectorService();
  injector.settings = createSettingsService(injector);
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
