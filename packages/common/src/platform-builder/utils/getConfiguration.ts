import {Type} from "@tsed/core";
import {GlobalProviders} from "@tsed/di";

export function getConfiguration(module: Type<any>, configuration: any = {}) {
  const provider = GlobalProviders.get(module)!;

  return {...(provider.configuration || {}), ...configuration};
}
