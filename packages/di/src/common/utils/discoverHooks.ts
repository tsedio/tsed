import {type AbstractType, type Type} from "@tsed/core/types/Type.js";
import {methodsOf} from "@tsed/core/utils/methodsOf.js";

export function discoverHooks(token: Type | AbstractType<any>) {
  return methodsOf(token).reduce((hooks, {propertyKey}) => {
    if (String(propertyKey).startsWith("$")) {
      const listener = (instance: any, ...args: any[]) => instance?.[propertyKey](...args);

      return {
        ...hooks,
        [propertyKey]: listener
      };
    }
    return hooks;
  }, {} as any);
}
