import {BadRequest} from "@tsed/exceptions";

export class AjvValidationError extends BadRequest {
  public name: string = "AJV_VALIDATION_ERROR";
  public errors: any[];

  constructor(message: string, errors: any[] = []) {
    super(message);
    this.errors = errors;
  }
}
