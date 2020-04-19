import {Exception} from "../core/Exception";

export class NotFound extends Exception {
  static readonly STATUS = 404;
  name: string = "NOT_FOUND";

  constructor(message: string, origin?: Error | string | any) {
    super(NotFound.STATUS, message, origin);
  }
}
