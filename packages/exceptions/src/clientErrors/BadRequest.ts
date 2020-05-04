import {Exception} from "../core/Exception";

export class BadRequest extends Exception {
  static readonly STATUS = 400;
  name: string = "BAD_REQUEST";

  constructor(message: string, origin?: Error | string | any) {
    super(BadRequest.STATUS, message, origin);
  }
}
