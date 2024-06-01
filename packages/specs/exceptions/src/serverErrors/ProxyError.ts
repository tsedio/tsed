import {ServerException} from "../core/ServerException.js";

export class ProxyError extends ServerException {
  static readonly STATUS = 502;
  name: string = "PROXY_ERROR";

  constructor(message: string, origin?: Error | string | any) {
    super(ProxyError.STATUS, message, origin);
  }
}
