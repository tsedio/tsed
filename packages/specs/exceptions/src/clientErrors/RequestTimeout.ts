import {Exception} from "../core/Exception";

export class RequestTimeout extends Exception {
  static readonly STATUS = 408;

  constructor(message: string, origin?: Error | string | any) {
    super(RequestTimeout.STATUS, message, origin);
  }
}
