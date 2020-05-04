import {ValidationError} from "@tsed/common";

export class AjvValidationError extends ValidationError {
  public name: string = "AJV_VALIDATION_ERROR";
}
