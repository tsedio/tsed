import {StoreSet, useDecorators} from "@tsed/core";
import {registerProvider} from "@tsed/di";
import type {FormioActionInfo} from "@tsed/formio-types";

/**
 * Create a new FormIO Action.
 * @param options
 * @decorator
 */
export function Action(options: FormioActionInfo): ClassDecorator {
  return useDecorators(
    (target: any) => {
      registerProvider({
        provide: target,
        type: "formio:action"
      });
    },
    StoreSet("formio:action", options)
  );
}
