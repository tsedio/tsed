import {ClientException} from "../core/ClientException.js";

export class NotFound extends ClientException {
  static readonly STATUS = 404;

  constructor(message: string, origin?: Error | string | any) {
    super(NotFound.STATUS, message, origin);
  }
}
