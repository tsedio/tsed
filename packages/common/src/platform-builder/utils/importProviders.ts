import {GlobalProviders, InjectorService, IProvider, Provider, ProviderType} from "@tsed/di";
import {IRoute} from "../../platform/interfaces/IRoute";
import {importComponents} from "./importComponents";

export async function importProviders(injector: InjectorService): Promise<IRoute[]> {
  injector.logger.debug("Scan components");

  const providers = await importAll(injector.settings);

  return providers.filter((provider) => !!provider.route).map(({route, token}) => ({route, token}));
}

async function importAll(settings: any): Promise<IProvider<any>[]> {
  const results = await Promise.all([
    importComponents(settings.imports, settings.exclude),
    importComponents(settings.mount, settings.exclude),
    importComponents(settings.componentsScan, settings.exclude)
  ]);

  const providers: IProvider<any>[] = ([] as any).concat(...results);

  const promises: any = providers
    .map(({token}) => GlobalProviders.get(token))
    .filter((provider) => provider?.type === ProviderType.MODULE && provider.configuration)
    .map((provider: Provider) => importAll({exclude: settings.exclude, ...provider.configuration}));

  return ([] as any).concat(...(await Promise.all(promises)), providers);
}
