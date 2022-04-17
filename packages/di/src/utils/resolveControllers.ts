import {isArray, isClass} from "@tsed/core";
import {TokenProvider} from "../interfaces/TokenProvider";
import {GlobalProviders} from "../registries/GlobalProviders";
import {ProviderType} from "../domain/ProviderType";
import {Provider} from "../domain/Provider";

const lookupProperties = ["mount", "imports"];

export function getTokens(config: any): {route?: string; token: TokenProvider}[] {
  if (!config) {
    return [];
  }

  if (isArray(config)) {
    return config.filter(isClass).map((value: any) => {
      return {token: value};
    });
  }

  return Object.keys(config).reduce((list: any[], route: string) => {
    return [
      ...list,
      ...[]
        .concat(config[route])
        .filter(isClass)
        .map((token) => ({
          route,
          token
        }))
    ];
  }, []);
}

function resolveRecursively(providers: {token: TokenProvider; route?: string}[]) {
  return providers
    .map(({token}) => GlobalProviders.get(token))
    .filter((provider) => provider?.type === ProviderType.MODULE && provider.configuration)
    .flatMap((provider: Provider) => resolveControllers(provider.configuration));
}

/**
 * Return controllers and is base route according to his configuration in module configuration.
 *
 * @param settings
 */
export function resolveControllers(settings: Partial<TsED.Configuration>): {token: string; route: string}[] {
  const providers = lookupProperties.flatMap((property) => getTokens(settings[property]));

  return [...resolveRecursively(providers), ...providers].filter((provider) => !!provider.route) as any[];
}
