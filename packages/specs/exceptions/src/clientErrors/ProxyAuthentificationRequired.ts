import {Exception} from "../core/Exception";

export class ProxyAuthentificationRequired extends Exception {
  static readonly STATUS = 407;

  constructor(message: string, origin?: Error | string | any) {
    super(ProxyAuthentificationRequired.STATUS, message, origin);
  }
}
