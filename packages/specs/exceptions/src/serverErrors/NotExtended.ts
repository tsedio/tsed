import {ServerException} from "../core/ServerException.js";

export class NotExtended extends ServerException {
  static readonly STATUS = 510;

  constructor(message: string, origin?: Error | string | any) {
    super(NotExtended.STATUS, message, origin);
  }
}
