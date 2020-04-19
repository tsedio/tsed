import {Exception} from "../core/Exception";

export class NotModified extends Exception {
  static readonly STATUS = 304;
  name: string = "NOT_MODIFIED";

  constructor(message: string, origin?: Error | string | any) {
    super(NotModified.STATUS, message, origin);
  }
}
