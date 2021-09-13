import {Exception} from "../core/Exception";

export class MovedPermanently extends Exception {
  static readonly STATUS = 301;

  constructor(message: string, origin?: Error | string | any) {
    super(MovedPermanently.STATUS, message, origin);
  }
}
