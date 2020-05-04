import {Exception} from "../core/Exception";

export class ProxyAuthentificationRequired extends Exception {
  static readonly STATUS = 407;
  name: string = "PROXY_AUTHENTIFICATION_REQUIRED";

  constructor(message: string, origin?: Error | string | any) {
    super(ProxyAuthentificationRequired.STATUS, message, origin);
  }
}
