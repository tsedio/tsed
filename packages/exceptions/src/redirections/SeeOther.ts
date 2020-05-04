import {Exception} from "../core/Exception";

export class SeeOther extends Exception {
  static readonly STATUS = 303;
  name: string = "SEE_OTHER";

  constructor(message: string, origin?: Error | string | any) {
    super(SeeOther.STATUS, message, origin);
  }
}
