import {Exception} from "../core/Exception";

export class NetworkAuthenticationRequired extends Exception {
  static readonly STATUS = 511;

  constructor(message: string, origin?: Error | string | any) {
    super(NetworkAuthenticationRequired.STATUS, message, origin);
  }
}
