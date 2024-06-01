import {ServerException} from "../core/ServerException.js";

export class ServiceUnavailable extends ServerException {
  static readonly STATUS = 503;

  constructor(message: string, origin?: Error | string | any) {
    super(ServiceUnavailable.STATUS, message, origin);
  }
}
