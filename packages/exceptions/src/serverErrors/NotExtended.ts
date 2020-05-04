import {Exception} from "../core/Exception";

export class NotExtended extends Exception {
  static readonly STATUS = 510;
  name: string = "NOT_EXTENDED";

  constructor(message: string, origin?: Error | string | any) {
    super(NotExtended.STATUS, message, origin);
  }
}
