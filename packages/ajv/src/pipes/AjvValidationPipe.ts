import {Inject, IPipe, OverrideProvider, ParamMetadata, ParamTypes, ValidationPipe} from "@tsed/common";
import {deserialize} from "@tsed/json-mapper";
import {getJsonSchema} from "@tsed/schema";
import Ajv from "ajv";
import {AjvErrorFormatterPipe} from "./AjvErrorFormatterPipe";

@OverrideProvider(ValidationPipe)
export class AjvValidationPipe extends ValidationPipe implements IPipe {
  @Inject()
  formatter: AjvErrorFormatterPipe;

  @Inject()
  ajv: Ajv;

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
    if (this.skip(value, metadata)) {
      return value;
    }

    value = this.coerceTypes(value, metadata);

    this.checkIsRequired(value, metadata);

    if (value === undefined) {
      return value;
    }

    const schema = getJsonSchema(metadata, {groups: metadata.parameter.groups, customKeys: true});

    if (schema) {
      const valid = await this.ajv.validate(schema, value);
      if (!valid) {
        throw this.formatter.transform(this.ajv.errors!, {
          type: metadata.isClass ? metadata.type : undefined,
          collectionType: metadata.collectionType,
          async: true,
          value
        });
      }
    }

    return value;
  }
}
