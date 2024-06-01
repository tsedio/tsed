import {ClientException} from "../core/ClientException.js";

export class PaymentRequired extends ClientException {
  static readonly STATUS = 402;

  constructor(message: string, origin?: Error | string | any) {
    super(PaymentRequired.STATUS, message, origin);
  }
}
