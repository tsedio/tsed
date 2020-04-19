import {Exception} from "../core/Exception";

export class RequestURITooLong extends Exception {
  static readonly STATUS = 414;
  name: string = "REQUEST_URI_TOO_LONG";

  constructor(message: string, origin?: Error | string | any) {
    super(RequestURITooLong.STATUS, message, origin);
  }
}
