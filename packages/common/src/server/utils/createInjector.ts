import {InjectorService} from "@tsed/di";
import {GlobalProviders, ProviderType, ServerSettingsService} from "../../..";

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
