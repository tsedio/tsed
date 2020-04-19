import {Exception} from "../core/Exception";

export class Conflict extends Exception {
  static readonly STATUS = 409;
  name: string = "CONFLICT";

  constructor(message: string, origin?: Error | string | any) {
    super(Conflict.STATUS, message, origin);
  }
}
