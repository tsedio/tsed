import {StoreSet, useDecorators} from "@tsed/core";
import {injectable} from "@tsed/di";

/**
 *
 * @param name
 * @constructor
 */
export function Alter(name: string): ClassDecorator {
  return useDecorators(
    (target: any) => {
      injectable(target).type("formio:alter");
    },
    StoreSet("formio:alter:name", name)
  );
}
