import {ClientException} from "../core/ClientException";

export class ExpectationFailed extends ClientException {
  static readonly STATUS = 417;

  constructor(message: string, origin?: Error | string | any) {
    super(ExpectationFailed.STATUS, message, origin);
  }
}
