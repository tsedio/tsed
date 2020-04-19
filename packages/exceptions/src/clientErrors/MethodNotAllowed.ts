import {Exception} from "../core/Exception";

export class MethodNotAllowed extends Exception {
  static readonly STATUS = 405;
  name: string = "METHOD_NOT_ALLOWED";

  constructor(message: string, origin?: Error | string | any) {
    super(MethodNotAllowed.STATUS, message, origin);
  }
}
