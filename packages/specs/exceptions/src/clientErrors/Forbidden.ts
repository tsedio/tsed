import {ClientException} from "../core/ClientException.js";

export class Forbidden extends ClientException {
  static readonly STATUS = 403;

  constructor(message: string, origin?: Error | string | any) {
    super(Forbidden.STATUS, message, origin);
  }
}
