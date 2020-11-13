import {Exception} from "../core/Exception";

export class BadRequest extends Exception {
  static readonly STATUS = 400;

  constructor(message: string, origin?: Error | string | any) {
    super(BadRequest.STATUS, message, origin);
  }
}
