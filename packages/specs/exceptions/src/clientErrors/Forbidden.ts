import {Exception} from "../core/Exception";

export class Forbidden extends Exception {
  static readonly STATUS = 403;

  constructor(message: string, origin?: Error | string | any) {
    super(Forbidden.STATUS, message, origin);
  }
}
