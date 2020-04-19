import {Exception} from "../core/Exception";

export class NetworkAuthenticationRequired extends Exception {
  static readonly STATUS = 511;
  name: string = "NETWORK_AUTHENTICATION_REQUIRED";

  constructor(message: string, origin?: Error | string | any) {
    super(NetworkAuthenticationRequired.STATUS, message, origin);
  }
}
