import {Exception} from "../core/Exception";

export class TooManyRequests extends Exception {
  static readonly STATUS = 429;
  name: string = "TOO_MANY_REQUESTS";

  constructor(message: string, origin?: Error | string | any) {
    super(TooManyRequests.STATUS, message, origin);
  }
}
