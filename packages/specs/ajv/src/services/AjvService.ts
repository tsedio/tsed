import "./Ajv.js";

import {deepClone, Type} from "@tsed/core";
import {constant, inject, injectable} from "@tsed/di";
import {compile, JsonSchema, JsonSchemaObject} from "@tsed/schema";
import {Ajv, ValidateFunction} from "ajv";

import {AjvSettings, ErrorFormatter} from "../interfaces/AjvSettings.js";
import {defaultErrorFormatter} from "../utils/defaultErrorFormatter.js";
import {mapErrors} from "../utils/mapErrors.js";

export interface AjvValidateOptions extends Record<string, any> {
  schema?: JsonSchema | Partial<JsonSchemaObject>;
  type?: Type<any> | any;
  collectionType?: Type<any> | any;
  returnsCoercedValues?: boolean;
}

export class AjvService {
  readonly name = "ajv";
  protected errorFormatter = constant<ErrorFormatter>("ajv.errorFormatter", defaultErrorFormatter as ErrorFormatter);
  protected returnsCoercedValues = constant<boolean>("ajv.returnsCoercedValues");
  protected hasLoadSchema = !!constant<AjvSettings["loadSchema"]>("ajv.loadSchema");
  protected ajv = inject(Ajv);
  protected validatorsBySchema = new WeakMap<object, ValidateFunction>();

  /**
   * Validate a value against a JSON schema, a model type, or explicit AJV options.
   *
   * The return type is inferred from `value` by default and can be overridden with an explicit generic:
   * `ajvService.validate<MyType>(value, options)`.
   *
   * If `returnsCoercedValues` is enabled globally or in `options`, coercions performed by AJV are returned.
   *
   * @typeParam TReturn Explicit return type override. When omitted, `TValue` is returned.
   * @typeParam TValue Input value type.
   * @param value Value to validate.
   * @param options Validation options or `JsonSchema`.
   * @returns The validated value (possibly coerced when configured).
   * @throws {AjvValidationError} When validation fails.
   */
  async validate<TReturn = never, TValue = unknown>(
    value: TValue,
    options: AjvValidateOptions
  ): Promise<[TReturn] extends [never] ? TValue : TReturn> {
    type ValidateResult = [TReturn] extends [never] ? TValue : TReturn;

    if (options.type || options.schema) {
      let {schema: defaultSchema, type, collectionType, returnsCoercedValues = this.returnsCoercedValues, ...additionalOptions} = options;

      const validate = await this.getValidator(defaultSchema || type, additionalOptions);

      const localValue = returnsCoercedValues ? value : deepClone(value);

      const valid = await validate(localValue);
      const {errors} = validate;

      if (!valid && errors) {
        throw mapErrors(errors, {
          type,
          collectionType,
          value: localValue,
          errorFormatter: this.errorFormatter
        });
      }

      if (returnsCoercedValues) {
        return localValue as ValidateResult;
      }
    }

    return value as ValidateResult;
  }

  /**
   * Resolve and compile a validator for the provided schema input.
   *
   * The compiled validator is cached by schema object identity to avoid
   * recompiling validators for repeated calls using the same schema instance.
   *
   * When `loadSchema` is configured, this method uses `compileAsync` to support
   * asynchronous external reference resolution.
   *
   * @param schema Schema source as `JsonSchema` instance or plain JSON schema object.
   * @returns Compiled AJV validate function.
   */
  protected async getValidator(input: Type | JsonSchema | JsonSchemaObject, additionalOptions: Record<string, any>) {
    const schema =
      input instanceof JsonSchema || typeof input === "function"
        ? compile(input, {
            ...additionalOptions,
            customKeys: true
          })
        : input;

    const cached = this.validatorsBySchema.get(schema);

    if (cached) {
      return cached;
    }

    const validate = this.hasLoadSchema ? await this.ajv.compileAsync(schema) : this.ajv.compile(schema);

    this.validatorsBySchema.set(schema, validate);

    return validate;
  }
}

injectable(AjvService).type("validator:service");
