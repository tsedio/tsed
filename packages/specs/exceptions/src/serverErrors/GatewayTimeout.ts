import {ServerException} from "../core/ServerException";

export class GatewayTimeout extends ServerException {
  static readonly STATUS = 504;

  constructor(message: string, origin?: Error | string | any) {
    super(GatewayTimeout.STATUS, message, origin);
  }
}
