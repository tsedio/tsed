import "./Ajv.js";

import {deepClone, getValue, nameOf, prototypeOf, setValue, Type} from "@tsed/core";
import {constant, inject, injectable} from "@tsed/di";
import {getJsonSchema, JsonEntityStore, JsonSchema, JsonSchemaObject} from "@tsed/schema";
import {Ajv, ErrorObject} from "ajv";

import {AjvValidationError} from "../errors/AjvValidationError.js";
import {AjvErrorObject, ErrorFormatter} from "../interfaces/AjvSettings.js";
import {defaultErrorFormatter} from "../utils/defaultErrorFormatter.js";
import {getPath} from "../utils/getPath.js";

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
  protected ajv = inject(Ajv);

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
    options: AjvValidateOptions | JsonSchema
  ): Promise<[TReturn] extends [never] ? TValue : TReturn> {
    type ValidateResult = [TReturn] extends [never] ? TValue : TReturn;

    let {
      schema: defaultSchema,
      type,
      collectionType,
      returnsCoercedValues = this.returnsCoercedValues,
      ...additionalOptions
    } = this.mapOptions(options);

    const schema = defaultSchema || getJsonSchema(type, {...additionalOptions, customKeys: true});

    if (schema) {
      const localValue = this.returnsCoercedValues ? value : deepClone(value);
      const validate = this.ajv.compile(schema);

      const valid = await validate(localValue);
      const {errors} = validate;

      if (!valid && errors) {
        throw this.mapErrors(errors, {
          type,
          collectionType,
          async: true,
          value: localValue
        });
      }

      if (returnsCoercedValues) {
        return localValue as ValidateResult;
      }
    }

    return value as ValidateResult;
  }

  protected mapOptions(options: AjvValidateOptions | JsonSchema): AjvValidateOptions {
    if (options instanceof JsonSchema) {
      return {
        schema: options.toJSON({customKeys: true})
      };
    }

    return options;
  }

  protected mapErrors(errors: ErrorObject[], options: any) {
    const {type, collectionType, value} = options;

    const message = (errors as AjvErrorObject[])
      .map((error) => {
        if (collectionType) {
          error.collectionName = nameOf(collectionType);
        }

        const dataPath = getPath(error);

        if (!error.data) {
          if (dataPath) {
            error.data = getValue(value, dataPath.replace(/^\./, ""));
          } else if (error.schemaPath !== "#/required") {
            error.data = value;
          }
        }

        if (dataPath && dataPath.match(/pwd|password|mdp|secret/)) {
          error.data = "[REDACTED]";
        }

        if (type) {
          error.modelName = nameOf(type);
          error.message = this.mapClassError(error, type);
        }

        return this.errorFormatter(error);
      })
      .join("\n");

    return new AjvValidationError(message, errors);
  }

  protected mapClassError(error: AjvErrorObject, targetType: Type<any>) {
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
}

injectable(AjvService).type("validator:service");
