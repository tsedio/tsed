import {BadRequest} from "@tsed/exceptions";
import {IResponseError} from "../interfaces/IResponseError";

export class ValidationError extends BadRequest implements IResponseError {
  public name: string = "VALIDATION_ERROR";
  public errors: any[];

  constructor(message: string, errors: any[] = []) {
    super(message);
    this.errors = errors;
  }
}
