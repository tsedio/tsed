import {ClientException} from "../core/ClientException";

export class RequestURITooLong extends ClientException {
  static readonly STATUS = 414;

  constructor(message: string, origin?: Error | string | any) {
    super(RequestURITooLong.STATUS, message, origin);
  }
}
