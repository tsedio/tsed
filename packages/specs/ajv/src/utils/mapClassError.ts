import {getValue, prototypeOf, setValue, Type} from "@tsed/core";
import {JsonEntityStore} from "@tsed/schema";

import {AjvErrorObject} from "../interfaces/AjvSettings.js";

/**
 * Rewrite class-related AJV messages using Ts.ED metadata.
 *
 * For missing required properties, this method replaces the property key by
 * the store-resolved property name when aliasing/naming is configured.
 *
 * @param error AJV error object to transform.
 * @param targetType Class used to resolve property metadata.
 * @returns Updated message when metadata exists, otherwise original message.
 */
export function mapClassError(error: AjvErrorObject, targetType: Type<any>) {
  const propertyKey = getValue(error, "params.missingProperty");

  if (propertyKey) {
    const store = JsonEntityStore.from<JsonEntityStore>(prototypeOf(targetType), propertyKey);

    if (store) {
      setValue(error, "params.missingProperty", store.name || propertyKey);

      return error.message?.replace(`'${propertyKey}'`, `'${store.name || propertyKey}'`);
    }
  }

  return error.message;
}
