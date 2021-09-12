import {Exception} from "../core/Exception";

export class UnavailableForLegalReasons extends Exception {
  static readonly STATUS = 451;

  constructor(message: string, origin?: Error | string | any) {
    super(UnavailableForLegalReasons.STATUS, message, origin);
  }
}
