import {inject} from "@tsed/di";
import {JsonSchema} from "@tsed/schema";

import {AjvService, type AjvValidateOptions} from "../services/AjvService.js";

/**
 * Validate a value against a JSON schema or a type using the configured `AjvService`.
 *
 * The return type is inferred from `value` by default and can be overridden with an explicit generic:
 * `validate<MyType>(value, options)`.
 *
 * @typeParam TReturn Explicit return type override. When omitted, `TValue` is returned.
 * @typeParam TValue Input value type.
 * @param value Value to validate.
 * @param options Validation options, a JSON schema, or a target type descriptor.
 * @returns The validated value. If `returnsCoercedValues` is enabled, it may contain coerced values.
 * @throws {AjvValidationError} When validation fails.
 */
export function validate<TReturn = never, TValue = unknown>(
  value: TValue,
  options: AjvValidateOptions | JsonSchema
): Promise<[TReturn] extends [never] ? TValue : TReturn> {
  return inject(AjvService).validate(value, options);
}
