import {Exception} from "../core/Exception";

export class Unauthorized extends Exception {
  static readonly STATUS = 401;
  name: string = "UNAUTHORIZED";

  constructor(message: string, origin?: Error | string | any) {
    super(Unauthorized.STATUS, message, origin);
  }
}
