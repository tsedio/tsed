import {nameOf} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {ParseExpressionError} from "../errors/ParseExpressionError";
import {IPipe, ParamMetadata} from "../models/ParamMetadata";
import {ValidationService} from "../services/ValidationService";

@Injectable()
export class ValidationPipe implements IPipe {
  constructor(private validationService: ValidationService) {}

  transform(value: any, param: ParamMetadata) {
    if (this.shouldValidate(param)) {
      const {collectionType} = param;
      const type = param.type || param.collectionType;

      try {
        this.validationService.validate(value, type, collectionType);
      } catch (err) {
        throw new ParseExpressionError(nameOf(param.service), param.expression, err);
      }
    }

    return value;
  }

  protected shouldValidate(param: ParamMetadata) {
    return !!(param.type || param.collectionType);
  }
}
