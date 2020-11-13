import {Exception} from "../core/Exception";

export class RequestHeaderFieldsTooLarge extends Exception {
  static readonly STATUS = 431;

  constructor(message: string, origin?: Error | string | any) {
    super(RequestHeaderFieldsTooLarge.STATUS, message, origin);
  }
}
