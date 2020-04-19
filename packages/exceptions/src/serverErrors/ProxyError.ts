import {Exception} from "../core/Exception";

export class ProxyError extends Exception {
  static readonly STATUS = 502;
  name: string = "PROXY_ERROR";

  constructor(message: string, origin?: Error | string | any) {
    super(ProxyError.STATUS, message, origin);
  }
}
