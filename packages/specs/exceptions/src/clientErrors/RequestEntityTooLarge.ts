import {ClientException} from "../core/ClientException";

export class RequestEntityTooLarge extends ClientException {
  static readonly STATUS = 413;

  constructor(message: string, origin?: Error | string | any) {
    super(RequestEntityTooLarge.STATUS, message, origin);
  }
}
