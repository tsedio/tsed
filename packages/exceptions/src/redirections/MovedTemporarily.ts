import {Exception} from "../core/Exception";

export class MovedTemporarily extends Exception {
  static readonly STATUS = 302;
  name: string = "MOVED_TEMPORARILY";

  constructor(message: string, origin?: Error | string | any) {
    super(MovedTemporarily.STATUS, message, origin);
  }
}
