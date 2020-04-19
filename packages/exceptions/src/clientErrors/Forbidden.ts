import {Exception} from "../core/Exception";

export class Forbidden extends Exception {
  static readonly STATUS = 403;
  name: string = "FORBIDDEN";

  constructor(message: string, origin?: Error | string | any) {
    super(Forbidden.STATUS, message, origin);
  }
}
