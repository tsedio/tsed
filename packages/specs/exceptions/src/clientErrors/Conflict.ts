import {ClientException} from "../core/ClientException";

export class Conflict extends ClientException {
  static readonly STATUS = 409;

  constructor(message: string, origin?: Error | string | any) {
    super(Conflict.STATUS, message, origin);
  }
}
