import {CustomKey, JsonEntityFn} from "@tsed/schema";

import {Component} from "./component.js";

/**
 * Change the label field
 * @decorator
 * @formio
 * @property
 * @schema
 * @param label
 */
export function Label(label: string) {
  return JsonEntityFn((entity) => {
    return entity.decoratorType === "property"
      ? Component({
          label
        })
      : CustomKey("x-formio-label", label);
  });
}
