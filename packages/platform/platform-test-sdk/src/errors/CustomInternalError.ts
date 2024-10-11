import {InternalServerError} from "@tsed/exceptions";
import {ResponseErrorObject} from "@tsed/platform-http";

export class CustomInternalError extends InternalServerError implements ResponseErrorObject {
  name = "CUSTOM_INTERNAL_SERVER_ERROR";
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
