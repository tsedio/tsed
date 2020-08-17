import {Injectable} from "@tsed/di";
import {RequiredValidationError} from "../errors/RequiredValidationError";
import {IPipe, ParamMetadata} from "../models/ParamMetadata";

@Injectable({
  type: "validator"
})
export class ValidationPipe implements IPipe {
  transform(value: any, metadata: ParamMetadata) {
    this.checkIsRequired(value, metadata);

    return value;
  }

  protected checkIsRequired(value: any, metadata: ParamMetadata) {
    if (metadata.isRequired(value)) {
      throw RequiredValidationError.from(metadata);
    }

    return true;
  }
}
