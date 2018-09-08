import {IResponseError} from "@tsed/common";

export class AjvValidationError extends Error implements IResponseError {
  public name: string = "AJV_VALIDATION_ERROR";
  public errors: any[];

  constructor(message: string, errors: any[]) {
    super(message);
    this.errors = errors;
  }
}
