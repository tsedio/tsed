import {BadRequest} from "@tsed/exceptions";

export class ValidationError extends BadRequest {
  public name: string = "VALIDATION_ERROR";
  public errors: any[];

  constructor(message: string, errors: any[] = []) {
    super(message);
    this.errors = errors;
  }
}
