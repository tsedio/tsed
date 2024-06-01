import {ClientException} from "../core/ClientException.js";

export class BadRequest extends ClientException {
  static readonly STATUS = 400;

  constructor(message: string, origin?: Error | string | any) {
    super(BadRequest.STATUS, message, origin);
  }
}
