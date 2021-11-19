import {isArray, isClass} from "@tsed/core";
import {importFiles} from "./importFiles";

async function resolveSymbols(item: any, excludes: string[], disableComponentsScan = false) {
  if (isClass(item)) {
    return [item];
  }
  /* istanbul ignore else */
  if (!disableComponentsScan) {
    return importFiles(item, excludes);
  }

  /* istanbul ignore next */
  return [];
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

export async function importComponents(
  config: any,
  excludes: string[],
  disableComponentsScan = false
): Promise<{token: string; route?: string}[]> {
  if (!config) {
    return [];
  }

  config = mapConfiguration(config);

  const promises: any = [];

  for (const option of config) {
    promises.push(
      ...option.values.map(async (value: any) => {
        const symbols = await resolveSymbols(value, excludes, disableComponentsScan);

        return symbols.filter(isClass).map((symbol) => ({token: symbol, route: option.endpoint}));
      })
    );
  }

  const result: {token: string; route?: string}[][] = await Promise.all(promises);

  return result.flat();
}
