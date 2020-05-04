import {Exception} from "../core/Exception";

export class MovedPermanently extends Exception {
  static readonly STATUS = 301;
  name: string = "MOVED_PERMANENTLY";

  constructor(message: string, origin?: Error | string | any) {
    super(MovedPermanently.STATUS, message, origin);
  }
}
