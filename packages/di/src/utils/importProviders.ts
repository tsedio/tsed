import {Provider} from "../domain/Provider";
import {IProvider} from "../interfaces/IProvider";
import {ProviderType} from "../domain/ProviderType";
import {GlobalProviders} from "../registries/GlobalProviders";
import {importComponents} from "./importComponents";

async function recursiveImports(providers: {token: string; route?: string}[], settings: Partial<TsED.Configuration>, properties: string[]) {
  const {exclude = []} = settings;

  const promises = providers
    .map(({token}) => GlobalProviders.get(token))
    .filter((provider) => provider?.type === ProviderType.MODULE && provider.configuration)
    .map((provider: Provider) => importProviders({exclude, ...provider.configuration}, properties));

  return (await Promise.all(promises)).flat();
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
): Promise<{token: string; route?: string}[]> {
  const {exclude = []} = settings;

  const promises = properties.map((key) => importComponents(settings[key], exclude));
  const providers = (await Promise.all(promises)).flat();
  const children = await recursiveImports(providers, settings, properties);

  return [...children, ...providers];
}
