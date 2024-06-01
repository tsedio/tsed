import {ClientException} from "../core/ClientException.js";

export class MethodNotAllowed extends ClientException {
  static readonly STATUS = 405;

  constructor(message: string, origin?: Error | string | any) {
    super(MethodNotAllowed.STATUS, message, origin);
  }
}
