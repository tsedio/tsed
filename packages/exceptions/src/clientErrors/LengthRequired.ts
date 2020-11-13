import {Exception} from "../core/Exception";

export class LengthRequired extends Exception {
  static readonly STATUS = 411;

  constructor(message: string, origin?: Error | string | any) {
    super(LengthRequired.STATUS, message, origin);
  }
}
