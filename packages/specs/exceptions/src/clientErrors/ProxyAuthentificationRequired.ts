import {ClientException} from "../core/ClientException";

export class ProxyAuthentificationRequired extends ClientException {
  static readonly STATUS = 407;

  constructor(message: string, origin?: Error | string | any) {
    super(ProxyAuthentificationRequired.STATUS, message, origin);
  }
}
