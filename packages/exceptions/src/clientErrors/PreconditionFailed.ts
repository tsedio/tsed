import {Exception} from "../core/Exception";

export class PreconditionFailed extends Exception {
  static readonly STATUS = 412;
  name: string = "PRECONDITION_FAILED";

  constructor(message: string, origin?: Error | string | any) {
    super(PreconditionFailed.STATUS, message, origin);
  }
}
