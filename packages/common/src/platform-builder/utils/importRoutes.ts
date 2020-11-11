import {importProviders, InjectorService} from "@tsed/di";
import {IRoute} from "../../platform/interfaces/IRoute";

export async function importRoutes(injector: InjectorService): Promise<IRoute[]> {
  injector.logger.debug("Scan components");

  const providers = await importProviders(injector.settings, ["imports", "mount", "componentsScan"]);

  return providers.filter((provider) => !!provider.route).map(({route, token}) => ({route, token}));
}
