import {ServerException} from "../core/ServerException";

export class VariantAlsoNegotiates extends ServerException {
  static readonly STATUS = 506;

  constructor(message: string, origin?: Error | string | any) {
    super(VariantAlsoNegotiates.STATUS, message, origin);
  }
}
