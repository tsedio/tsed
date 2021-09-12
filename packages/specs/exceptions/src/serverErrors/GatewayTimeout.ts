import {Exception} from "../core/Exception";

export class GatewayTimeout extends Exception {
  static readonly STATUS = 504;

  constructor(message: string, origin?: Error | string | any) {
    super(GatewayTimeout.STATUS, message, origin);
  }
}
