import {ClientException} from "../core/ClientException";

export class RequestHeaderFieldsTooLarge extends ClientException {
  static readonly STATUS = 431;

  constructor(message: string, origin?: Error | string | any) {
    super(RequestHeaderFieldsTooLarge.STATUS, message, origin);
  }
}
