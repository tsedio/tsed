import {ConverterService, getJsonSchema, Inject, IPipe, OverrideProvider, ParamMetadata, ParamTypes, ValidationPipe} from "@tsed/common";
import {isEmpty} from "@tsed/core";
import {AJV} from "../services/Ajv";
import {AjvErrorFormatterPipe} from "./AjvErrorFormatterPipe";

@OverrideProvider(ValidationPipe)
export class AjvValidationPipe extends ValidationPipe implements IPipe {
  @Inject()
  converterService: ConverterService; // FIXME remove mapping when the new schema lib will be released

  @Inject()
  formatter: AjvErrorFormatterPipe;

  @Inject(AJV)
  ajv: AJV;

  transform(value: any, metadata: ParamMetadata): any {
    this.checkIsRequired(value, metadata);

    const {schema} = metadata.store.get(AjvValidationPipe) || {};

    if (schema) {
      this.validate(schema, value);
    } else if (metadata.isPrimitive) {
      this.validateFromPrimitive(value, metadata);
    } else if (this.shouldValidate(metadata) && value !== undefined) {
      this.validateFromModel(value, metadata);
    }

    return value;
  }

  protected validate(schema: any, value: any, options: any = {}) {
    const valid = this.ajv.validate(schema, value);

    if (!valid) {
      throw this.formatter.transform(this.ajv.errors!, options);
    }
  }

  protected validateFromPrimitive(value: any, metadata: ParamMetadata) {
    value = this.converterService.deserialize(value, metadata.collectionType || metadata.type, metadata.type);

    if (isEmpty(value)) {
      if (this.checkIsRequired(value, metadata)) {
        return true;
      }
    }

    const schema = getJsonSchema(metadata.type);

    if (!metadata.isCollection) {
      this.validate(schema, value, {});
    } else {
      Object.entries(value).forEach(([key, item]) => {
        this.validate(schema, item, {index: key});
      });
    }

    return value;
  }

  private validateFromModel(value: any, metadata: ParamMetadata) {
    const schema = getJsonSchema(metadata.type);

    const options = {
      ignoreCallback: (obj: any, type: any) => type === Date,
      checkRequiredValue: false,
      additionalProperties: metadata.paramType === ParamTypes.QUERY ? "ignore" : undefined
    };

    if (metadata.isCollection) {
      if (value) {
        Object.entries(value).forEach(([key, item]) => {
          item = this.converterService.deserialize(item, metadata.type, undefined, options as any); // FIXME REMOVE THIS when @tsed/schema is out
          this.validate(schema, item, {type: metadata.type, index: key});
        });
      }
    } else {
      value = this.converterService.deserialize(value, metadata.type, undefined, options as any); // FIXME REMOVE THIS when @tsed/schema is out
      this.validate(schema, value, {type: metadata.type});
    }
  }
}
