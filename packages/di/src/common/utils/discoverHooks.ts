import {type AbstractType, methodsOf, type Type} from "@tsed/core";

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
