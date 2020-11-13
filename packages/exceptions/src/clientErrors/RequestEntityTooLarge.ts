import {Exception} from "../core/Exception";

export class RequestEntityTooLarge extends Exception {
  static readonly STATUS = 413;

  constructor(message: string, origin?: Error | string | any) {
    super(RequestEntityTooLarge.STATUS, message, origin);
  }
}
