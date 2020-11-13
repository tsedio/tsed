import {Exception} from "../core/Exception";

export class PreconditionRequired extends Exception {
  static readonly STATUS = 428;

  constructor(message: string, origin?: Error | string | any) {
    super(PreconditionRequired.STATUS, message, origin);
  }
}
