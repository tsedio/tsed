import {StoreSet, useDecorators} from "@tsed/core";
import {FormioActionInfo} from "@tsed/formio-types";
import {registerProvider} from "@tsed/di";

/**
 * Create a new FormIO Action.
 * @param options
 * @decorator
 */
export function Action(options: FormioActionInfo): ClassDecorator {
  return useDecorators(
    (target: any) => {
      registerProvider({
        token: target,
        type: "formio:action"
      });
    },
    StoreSet("formio:action", options)
  );
}
