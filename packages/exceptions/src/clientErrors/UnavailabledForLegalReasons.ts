import {Exception} from "../core/Exception";

export class UnavailabledForLegalReasons extends Exception {
  static readonly STATUS = 451;
  name: string = "UNAVAILABLED_FOR_LEGAL_REASONS";

  constructor(message: string, origin?: Error | string | any) {
    super(UnavailabledForLegalReasons.STATUS, message, origin);
  }
}
