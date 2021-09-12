import {Exception} from "../core/Exception";

export class TooManyRequests extends Exception {
  static readonly STATUS = 429;

  constructor(message: string, origin?: Error | string | any) {
    super(TooManyRequests.STATUS, message, origin);
  }
}
