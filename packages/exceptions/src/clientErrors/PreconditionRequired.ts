import {Exception} from "../core/Exception";

export class PreconditionRequired extends Exception {
  static readonly STATUS = 428;
  name: string = "PRECONDITION_REQUIRED";

  constructor(message: string, origin?: Error | string | any) {
    super(PreconditionRequired.STATUS, message, origin);
  }
}
