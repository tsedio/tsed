import {isArray, isClass, isString} from "@tsed/core";
import {GlobalProviders, ProviderType} from "@tsed/di";

import {importFiles} from "./importFiles.js";

const lookup = ["imports", "componentsScan", "mount"];

async function resolveRecursively(items: any[], exclude: string[], rootDir: string) {
  for (const index in items) {
    if (isString(items[index])) {
      items[index] = await importFiles(items[index].replace("${rootDir}", rootDir), exclude);
    }
  }

  const providers = items.flat().filter(isClass);

  for (const token of providers) {
    const provider = GlobalProviders.get(token);

    if (provider?.type === ProviderType.MODULE && provider.configuration) {
      provider.configuration.exclude = exclude;
      provider.configuration.rootDir = provider.configuration.rootDir || rootDir;

      provider.configuration = await importProviders(provider.configuration);
    }
  }

  return providers;
}

/**
 * Lookup settings and replace glob pattern by the resolved providers
 *
 * @param settings
 */
export async function importProviders(settings: Record<string, any>): Promise<Partial<TsED.Configuration>> {
  const {exclude = [], rootDir} = settings;

  for (const property of lookup) {
    if (settings[property]) {
      if (!isArray(settings[property])) {
        const current = settings[property];
        const promises = Object.entries(current).map(async ([key, items]: [string, any]) => {
          current[key] = await resolveRecursively([].concat(items), exclude, rootDir);
        });

        await Promise.all(promises);
      } else {
        settings[property] = await resolveRecursively(settings[property], exclude, rootDir);
      }
    }
  }

  settings.disableComponentsScan = true;

  return settings;
}
