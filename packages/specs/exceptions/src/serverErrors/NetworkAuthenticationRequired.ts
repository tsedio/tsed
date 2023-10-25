import {ServerException} from "../core/ServerException";

export class NetworkAuthenticationRequired extends ServerException {
  static readonly STATUS = 511;

  constructor(message: string, origin?: Error | string | any) {
    super(NetworkAuthenticationRequired.STATUS, message, origin);
  }
}
