import {BadRequest} from "@tsed/exceptions";
import {ResponseErrorObject} from "@tsed/platform-http";

export class CustomBadRequest extends BadRequest implements ResponseErrorObject {
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
