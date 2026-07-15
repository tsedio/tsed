import {DecoratorTypes, isClass, useDecorators} from "@tsed/core";

import type {JsonParameterStore} from "../../components/stores/JsonParameterStore.js";
import {JsonEntityFn} from "./jsonEntityFn.js";
import {Property} from "./property.js";

/**
 * Adds specific values to the list of allowed values for required properties or parameters.
 *
 * When a property or parameter is marked as required, it typically rejects `null`, `undefined`,
 * and empty strings. The `@Allow()` decorator lets you explicitly permit certain values that
 * would otherwise fail required validation.
 *
 * ### Common Use Case: Allow Empty Strings
 *
 * By default, required fields reject empty strings. Use `@Allow("")` to permit them:
 *
 * ```typescript
 * class UserModel {
 *   @Required()
 *   @Allow("")  // Empty string is now valid even though field is required
 *   nickname: string;
 * }
 * ```
 *
 * ### On Method Parameters
 *
 * ```typescript
 * @Post("/")
 * async createUser(
 *   @Allow("")
 *   @BodyParams("nickname")
 *   nickname: string  // Empty string allowed, but null/undefined still rejected
 * ) {
 *   // nickname can be "" but not null/undefined
 * }
 * ```
 *
 * ### Multiple Allowed Values
 *
 * ```typescript
 * class ConfigModel {
 *   @Required()
 *   @Allow(null, "", 0)  // Allow null, empty string, or zero
 *   threshold: number | null;
 * }
 * ```
 *
 * ### Combining with Type Specification
 *
 * You can specify a model type along with allowed values:
 *
 * ```typescript
 * class FormData {
 *   @Allow("", SomeModel)  // Allow empty string or a SomeModel instance
 *   data: SomeModel;
 * }
 * ```
 *
 * ### Behavior
 *
 * - For **parameters**: Automatically marks the parameter as required
 * - For **properties**: Automatically adds the property to the required list
 * - Adds specified values to the schema's allowedRequiredValues list
 *
 * ### Validation Logic
 *
 * Required validation will pass if the value is:
 * - Not `null`, `undefined`, or `""` (default required behavior)
 * - OR one of the values specified in `@Allow()`
 *
 * @param values - Values to allow even when the field is required (can include a model class)
 *
 * @decorator
 * @validation
 * @public
 */
export function Allow(...values: any[]) {
  const model = values.find((item) => isClass(item));
  return useDecorators(
    model && Property(model),
    JsonEntityFn((store, args) => {
      if (store.decoratorType === DecoratorTypes.PARAM) {
        (store as JsonParameterStore).required = true;
      }

      if (store.decoratorType === DecoratorTypes.PROP) {
        store.parentSchema.addRequired(store.propertyName);
      }

      store.schema.allow(...values);
    })
  );
}
