import {Exception} from "../core/Exception";

export class Gone extends Exception {
  static readonly STATUS = 410;

  constructor(message: string, origin?: Error | string | any) {
    super(Gone.STATUS, message, origin);
  }
}
