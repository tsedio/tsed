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
  config = mapConfiguration(config);

  const list: Partial<IProvider<any>>[] = [];

  for (const option of config) {
    for (const value of option.values) {
      const symbols = await resolveSymbols(value, excludes);

      symbols
        .filter(symbol => isClass(symbol))
        .forEach(symbol => {
          const provider: Partial<IProvider<any>> = {provide: symbol, endpoint: option.endpoint};

          list.push(provider);
        });
    }
  }

  return list;
}
