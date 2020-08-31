import {BadRequest} from "@tsed/exceptions";
import {ResponseErrorObject} from "../interfaces/ResponseErrorObject";

export class ValidationError extends BadRequest implements ResponseErrorObject {
  public name: string = "VALIDATION_ERROR";
  public errors: any[];

  constructor(message: string, errors: any[] = []) {
    super(message);
    this.errors = errors;
  }
}
