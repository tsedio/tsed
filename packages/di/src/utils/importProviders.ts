import {Provider} from "../class/Provider";
import {IProvider} from "../interfaces/IProvider";
import {ProviderType} from "../interfaces/ProviderType";
import {GlobalProviders} from "../registries/GlobalProviders";
import {importComponents} from "./importComponents";

const concatProviders = (results: any): IProvider<any>[] => {
  return [].concat(...results);
};

async function recursiveImports(providers: IProvider<any>[], settings: Partial<TsED.Configuration>, properties: string[]) {
  const {exclude = []} = settings;

  const promises = providers
    .map(({token}) => GlobalProviders.get(token))
    .filter((provider) => provider?.type === ProviderType.MODULE && provider.configuration)
    .map((provider: Provider) => importProviders({exclude, ...provider.configuration}, properties));

  return concatProviders(await Promise.all(promises));
}

/**
 * Import providers from given patterns.
 *
 * @param settings
 * @param properties
 */
export async function importProviders(
  settings: Partial<TsED.Configuration>,
  properties: string[] = ["imports"]
): Promise<IProvider<any>[]> {
  const {exclude = []} = settings;

  const promises = properties.map((key) => importComponents(settings[key], exclude));
  const providers = concatProviders(await Promise.all(promises));
  const children = await recursiveImports(providers, settings, properties);

  return [...children, ...providers];
}
