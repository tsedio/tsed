import {StoreSet, useDecorators} from "@tsed/core";
import {registerProvider} from "@tsed/di";

/**
 * Create a Form io hook event listener
 * @param name
 * @constructor
 */
export function On(name: string): ClassDecorator {
  return useDecorators(
    (target: any) => {
      registerProvider({
        token: target,
        type: "formio:on"
      });
    },
    StoreSet("formio:on:name", name)
  );
}
