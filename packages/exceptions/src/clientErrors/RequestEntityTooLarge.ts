import {Exception} from "../core/Exception";

export class RequestEntityTooLarge extends Exception {
  static readonly STATUS = 413;
  name: string = "REQUEST_ENTITY_TOO_LARGE";

  constructor(message: string, origin?: Error | string | any) {
    super(RequestEntityTooLarge.STATUS, message, origin);
  }
}
