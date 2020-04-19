import {Exception} from "../core/Exception";

export class ExpectationFailed extends Exception {
  static readonly STATUS = 417;
  name: string = "EXPECTATION_FAILED";

  constructor(message: string, origin?: Error | string | any) {
    super(ExpectationFailed.STATUS, message, origin);
  }
}
