import {nameOf} from "@tsed/core";
import {Injectable, InjectorService} from "@tsed/di";
import {deserialize} from "@tsed/json-mapper";
import {getJsonSchema} from "@tsed/schema";
import {RequiredValidationError} from "../errors/RequiredValidationError";
import {IPipe, ParamMetadata} from "../models/ParamMetadata";
import {ParamTypes} from "../models/ParamTypes";

@Injectable({
  type: "validator"
})
export class ValidationPipe implements IPipe {
  private validator: {validate(value: any, options: any): Promise<any>};

  constructor(injector: InjectorService) {
    const provider = injector.getProviders().find((provider) => nameOf(provider.token) === "AjvService");

    if (provider) {
      this.validator = injector.invoke<any>(provider.token);
    }
  }

  coerceTypes(value: any, metadata: ParamMetadata) {
    if (value === undefined) {
      return value;
    }

    if (value === "null") {
      return null;
    }

    if (metadata.isPrimitive) {
      try {
        return deserialize(value, {
          type: metadata.type
        });
      } catch (er) {
        return value;
      }
    }

    if (metadata.isArray) {
      return [].concat(value);
    }

    return value;
  }

  skip(value: any, metadata: ParamMetadata) {
    return metadata.paramType === ParamTypes.PATH && !metadata.isPrimitive;
  }

  async transform(value: any, metadata: ParamMetadata): Promise<any> {
    if (!this.validator) {
      this.checkIsRequired(value, metadata);
      return value;
    }

    if (this.skip(value, metadata)) {
      return value;
    }

    value = this.coerceTypes(value, metadata);

    this.checkIsRequired(value, metadata);

    if (value === undefined) {
      return value;
    }

    await this.validator.validate(value, {
      schema: getJsonSchema(metadata, {groups: metadata.parameter.groups, customKeys: true}),
      type: metadata.isClass ? metadata.type : undefined,
      collectionType: metadata.collectionType
    });

    return value;
  }

  protected checkIsRequired(value: any, metadata: ParamMetadata) {
    if (metadata.isRequired(value)) {
      throw RequiredValidationError.from(metadata);
    }

    return true;
  }
}
