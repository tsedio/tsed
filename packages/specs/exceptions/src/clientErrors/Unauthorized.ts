import {ClientException} from "../core/ClientException";

export class Unauthorized extends ClientException {
  static readonly STATUS = 401;

  constructor(message: string, origin?: Error | string | any) {
    super(Unauthorized.STATUS, message, origin);
  }
}
