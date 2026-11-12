import type {MaybePromise} from "@tsed/core";
import {JsonParameterStore, PipeMethods, compile} from "@tsed/schema";
import {constant, injectMany, injectable} from "@tsed/di";
import {ParamTypes} from "../domain/ParamTypes.js";
import {RequiredValidationError} from "../errors/RequiredValidationError.js";
import {deserialize} from "@tsed/json-mapper";

function cast(value: any, metadata: JsonParameterStore) {
  try {
    return deserialize(value, {
      type: metadata.type
    });
  } catch (er) {
    return value;
  }
}

export interface ValidatorServiceMethods {
  readonly name: string;

  validate(value: any, options: any): Promise<any>;

  /**
   * Optional: validate without waiting for a promise when the validation is synchronous. When a validator has it, the
   * `ValidationPipe` calls it instead of `validate()`, so the parameter can be resolved in the same tick.
   */
  validateValue?(value: any, options: any): MaybePromise<any>;
}

export class ValidationPipe implements PipeMethods {
  private validators: Map<string, ValidatorServiceMethods> = new Map();
  // the schema of a parameter is compiled once, not on each request
  #schemas = new WeakMap<JsonParameterStore, ReturnType<typeof compile>>();

  constructor() {
    const validators = injectMany<ValidatorServiceMethods>("validator:service");
    const defaultValidator = constant("validators.default");

    validators.length && this.validators.set("default", validators[0]);

    validators.map((service) => {
      this.validators.set(service.name, service);

      if (service.name === defaultValidator) {
        this.validators.set("default", service);
      }
    });
  }

  coerceTypes(value: any, metadata: JsonParameterStore) {
    if (value === undefined) {
      return value;
    }

    if (value === "null") {
      return null;
    }

    if (metadata.isArray) {
      return [].concat(value);
    }

    if (metadata.isPrimitive) {
      return cast(value, metadata);
    }

    return value;
  }

  skip(value: any, metadata: JsonParameterStore) {
    return metadata.paramType === ParamTypes.PATH && !metadata.isPrimitive;
  }

  transform(value: any, metadata: JsonParameterStore): MaybePromise<any> {
    if (!this.validators.size) {
      this.checkIsRequired(value, metadata);
      return value;
    }

    // FIXME See if it's necessary ?
    if (this.skip(value, metadata)) {
      return value;
    }

    value = this.coerceTypes(value, metadata);

    this.checkIsRequired(value, metadata);

    if (value === undefined) {
      return value;
    }

    // TODO retrieve the right validator from metadata
    const validator = this.validators.get("default");

    if (validator) {
      const options = {
        schema: this.getSchema(metadata),
        type: metadata.isClass ? metadata.type : undefined,
        collectionType: metadata.collectionType
      };

      return validator.validateValue ? validator.validateValue(value, options) : validator.validate(value, options);
    }

    return value;
  }

  protected getSchema(metadata: JsonParameterStore) {
    let schema = this.#schemas.get(metadata);

    if (!schema) {
      schema = compile(metadata, {
        customKeys: true
      });

      this.#schemas.set(metadata, schema);
    }

    return schema;
  }

  protected checkIsRequired(value: any, metadata: JsonParameterStore) {
    if (metadata.isRequired(value)) {
      throw RequiredValidationError.from(metadata);
    }

    return true;
  }
}

injectable(ValidationPipe).type("validator");
