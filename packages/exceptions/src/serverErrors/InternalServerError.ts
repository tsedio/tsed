import {Exception} from "../core/Exception";

export class InternalServerError extends Exception {
  static readonly STATUS = 500;
  name: string = "INTERNAL_SERVER_ERROR";

  constructor(message: string, origin?: Error | string | any) {
    super(InternalServerError.STATUS, message, origin);
  }
}
