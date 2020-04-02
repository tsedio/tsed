import {InjectorService, IProvider} from "@tsed/di";
import {IRoute} from "../../platform/interfaces/IRoute";
import {importComponents} from "./importComponents";

export async function importProviders(injector: InjectorService): Promise<IRoute[]> {
  injector.logger.debug("Scan components");

  const providers: IProvider<any>[] = ([] as any).concat(
    ...(await Promise.all([
      importComponents(injector.settings.mount, injector.settings.exclude),
      importComponents(injector.settings.componentsScan, injector.settings.exclude)
    ]))
  );

  return providers.filter(provider => !!provider.route).map(({route, token}) => ({route, token}));
}
