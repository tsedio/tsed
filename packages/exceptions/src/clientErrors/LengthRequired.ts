import {Exception} from "../core/Exception";

export class LengthRequired extends Exception {
  static readonly STATUS = 411;
  name: string = "LENGTH_REQUIRED";

  constructor(message: string, origin?: Error | string | any) {
    super(LengthRequired.STATUS, message, origin);
  }
}
