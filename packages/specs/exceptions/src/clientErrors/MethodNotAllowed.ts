import {Exception} from "../core/Exception";

export class MethodNotAllowed extends Exception {
  static readonly STATUS = 405;

  constructor(message: string, origin?: Error | string | any) {
    super(MethodNotAllowed.STATUS, message, origin);
  }
}
