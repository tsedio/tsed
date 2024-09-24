import {StoreSet, useDecorators} from "@tsed/core";
import {registerProvider} from "@tsed/di";

/**
 *
 * @param name
 * @constructor
 */
export function Alter(name: string): ClassDecorator {
  return useDecorators(
    (target: any) => {
      registerProvider({
        provide: target,
        type: "formio:alter"
      });
    },
    StoreSet("formio:alter:name", name)
  );
}
