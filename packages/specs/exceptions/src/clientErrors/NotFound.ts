import {Exception} from "../core/Exception";

export class NotFound extends Exception {
  static readonly STATUS = 404;

  constructor(message: string, origin?: Error | string | any) {
    super(NotFound.STATUS, message, origin);
  }
}
