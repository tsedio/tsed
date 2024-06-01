import {ServerException} from "../core/ServerException.js";

export class BadGateway extends ServerException {
  static readonly STATUS = 502;

  constructor(message: string, origin?: Error | string | any) {
    super(BadGateway.STATUS, message, origin);
  }
}
