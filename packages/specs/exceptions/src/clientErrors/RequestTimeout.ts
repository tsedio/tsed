import {ClientException} from "../core/ClientException.js";

export class RequestTimeout extends ClientException {
  static readonly STATUS = 408;

  constructor(message: string, origin?: Error | string | any) {
    super(RequestTimeout.STATUS, message, origin);
  }
}
