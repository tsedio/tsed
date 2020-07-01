import {Injectable} from "@tsed/di";
import {RequiredValidationError} from "../errors/RequiredValidationError";
import {IPipe, ParamMetadata} from "../models/ParamMetadata";
import {ValidationService} from "../services/ValidationService";

@Injectable({
  type: "validator"
})
export class ValidationPipe implements IPipe {
  constructor(protected validationService: ValidationService) {}

  transform(value: any, metadata: ParamMetadata) {
    this.checkIsRequired(value, metadata);

    if (this.shouldValidate(metadata)) {
      const {collectionType} = metadata;
      const type = metadata.type || metadata.collectionType;

      this.validationService.validate(value, type, collectionType);
    }

    return value;
  }

  protected checkIsRequired(value: any, metadata: ParamMetadata) {
    if (metadata.isRequired(value)) {
      throw RequiredValidationError.from(metadata);
    }

    return true;
  }
}
