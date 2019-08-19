import {InjectorService} from "@tsed/di";
import {importComponents} from "./importComponents";

export async function resolveProviders(injector: InjectorService) {
  const providers = await Promise.all([
    importComponents(injector.settings.mount, injector.settings.exclude),
    importComponents(injector.settings.componentsScan, injector.settings.exclude)
  ]);

  return ([] as any).concat(...providers);
}
