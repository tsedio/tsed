import {ServerException} from "../core/ServerException.js";

export class InternalServerError extends ServerException {
  static readonly STATUS = 500;

  constructor(message: string, origin?: Error | string | any) {
    super(InternalServerError.STATUS, message, origin);
  }
}
