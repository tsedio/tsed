import {nameOf, Type} from "@tsed/core";
import {InternalServerError} from "@tsed/exceptions";

export class UnknownFilterError extends InternalServerError {
  name: "UNKNOWN_FILTER_ERROR";
  status: 500;

  constructor(target: Type<any>) {
    super(`Filter ${nameOf(target)} not found.`);
  }
}
