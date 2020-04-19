import {Exception} from "../core/Exception";

export class VariantAlsoNegotiates extends Exception {
  static readonly STATUS = 506;
  name: string = "VARIANT_ALSO_NEGOTIATES";

  constructor(message: string, origin?: Error | string | any) {
    super(VariantAlsoNegotiates.STATUS, message, origin);
  }
}
