import {constructorOf, deepExtends} from "@tsed/core";
import {GlobalProviders} from "@tsed/di";

export function getConfiguration(module: any, configuration: any = {}) {
  const provider = GlobalProviders.get(constructorOf(module))!;

  return deepExtends({...provider.configuration}, configuration);
}
