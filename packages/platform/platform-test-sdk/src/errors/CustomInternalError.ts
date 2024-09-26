import type {ResponseErrorObject} from "@tsed/common";
import {InternalServerError} from "@tsed/exceptions";

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
