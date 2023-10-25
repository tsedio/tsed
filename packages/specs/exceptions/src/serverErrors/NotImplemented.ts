import {ServerException} from "../core/ServerException";

export class NotImplemented extends ServerException {
  static readonly STATUS = 501;

  constructor(message: string, origin?: Error | string | any) {
    super(NotImplemented.STATUS, message, origin);
  }
}
