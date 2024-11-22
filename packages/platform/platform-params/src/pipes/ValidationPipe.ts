import {constant, injectable, injectMany} from "@tsed/di";
import {deserialize} from "@tsed/json-mapper";
import {getJsonSchema, JsonParameterStore, PipeMethods} from "@tsed/schema";

import {ParamTypes} from "../domain/ParamTypes.js";
import {RequiredValidationError} from "../errors/RequiredValidationError.js";

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
}

export class ValidationPipe implements PipeMethods {
  private validators: Map<string, ValidatorServiceMethods> = new Map();

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

  transform(value: any, metadata: JsonParameterStore): Promise<any> {
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

    const schema = getJsonSchema(metadata, {
      customKeys: true
    });

    // TODO retrieve the right validator from metadata
    const validator = this.validators.get("default");

    if (validator) {
      return validator.validate(value, {
        schema,
        type: metadata.isClass ? metadata.type : undefined,
        collectionType: metadata.collectionType
      });
    }

    return value;
  }

  protected checkIsRequired(value: any, metadata: JsonParameterStore) {
    if (metadata.isRequired(value)) {
      throw RequiredValidationError.from(metadata);
    }

    return true;
  }
}

injectable(ValidationPipe).type("validator");
