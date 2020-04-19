import {Exception} from "../core/Exception";

export class PaymentRequired extends Exception {
  static readonly STATUS = 402;
  name: string = "PAYMENT_REQUIRED";

  constructor(message: string, origin?: Error | string | any) {
    super(PaymentRequired.STATUS, message, origin);
  }
}
