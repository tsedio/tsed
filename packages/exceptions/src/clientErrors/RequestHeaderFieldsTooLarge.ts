import {Exception} from "../core/Exception";

export class RequestHeaderFieldsTooLarge extends Exception {
  static readonly STATUS = 431;
  name: string = "REQUEST_HEADER_FIELDS_TOO_LARGE";

  constructor(message: string, origin?: Error | string | any) {
    super(RequestHeaderFieldsTooLarge.STATUS, message, origin);
  }
}
