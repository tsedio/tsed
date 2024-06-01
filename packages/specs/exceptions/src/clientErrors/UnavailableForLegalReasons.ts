import {ClientException} from "../core/ClientException.js";

export class UnavailableForLegalReasons extends ClientException {
  static readonly STATUS = 451;

  constructor(message: string, origin?: Error | string | any) {
    super(UnavailableForLegalReasons.STATUS, message, origin);
  }
}
