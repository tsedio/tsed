import {ClientException} from "../core/ClientException";

export class TooManyRequests extends ClientException {
  static readonly STATUS = 429;

  constructor(message: string, origin?: Error | string | any) {
    super(TooManyRequests.STATUS, message, origin);
  }
}
