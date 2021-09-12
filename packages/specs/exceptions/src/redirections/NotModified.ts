import {Exception} from "../core/Exception";

export class NotModified extends Exception {
  static readonly STATUS = 304;

  constructor(message: string, origin?: Error | string | any) {
    super(NotModified.STATUS, message, origin);
  }
}
