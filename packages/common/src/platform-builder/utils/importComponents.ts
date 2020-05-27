import {isArray, isClass} from "@tsed/core";
import {IProvider} from "@tsed/di";
import {importFiles} from "./importFiles";

async function resolveSymbols(item: any, excludes: string[]) {
  if (isClass(item)) {
    return await [item];
  }

  return importFiles(item, excludes);
}

export function mapConfiguration(config: any): {endpoint?: string; values: any[]}[] {
  if (isArray(config)) {
    return config.map((value: any) => {
      return {
        values: [].concat(value)
      };
    });
  }

  return Object.keys(config).reduce((list: any[], key: string) => {
    list.push({
      endpoint: key,
      values: [].concat(config[key])
    });

    return list;
  }, []);
}

export async function importComponents(config: any, excludes: string[]): Promise<Partial<IProvider<any>>[]> {
  if (!config) {
    return [];
  }

  config = mapConfiguration(config);

  const promises: any = [];
  for (const option of config) {
    promises.push(
      ...option.values.map(async (value: any) => {
        const symbols = await resolveSymbols(value, excludes);

        return symbols
          .filter(symbol => isClass(symbol))
          .map(symbol => {
            const provider: Partial<IProvider<any>> = {token: symbol, route: option.endpoint};

            return provider;
          });
      })
    );
  }

  const result = await Promise.all(promises);

  return ([] as any).concat(...result);
}
