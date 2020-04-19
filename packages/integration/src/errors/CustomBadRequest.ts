import {IResponseError} from "@tsed/common";
import {BadRequest} from "@tsed/exceptions";

export class CustomBadRequest extends BadRequest implements IResponseError {
  name = "CUSTOM_BAD_REQUEST";
  errors: any[];
  headers = {};

  constructor(message: string) {
    super(message);
    this.errors = ["test"];
    this.headers = {
      "X-HEADER-ERROR": "deny"
    };
  }
}
