import {Exception} from "../core/Exception";

export class PaymentRequired extends Exception {
  static readonly STATUS = 402;

  constructor(message: string, origin?: Error | string | any) {
    super(PaymentRequired.STATUS, message, origin);
  }
}
