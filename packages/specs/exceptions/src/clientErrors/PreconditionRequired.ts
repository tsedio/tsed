import {ClientException} from "../core/ClientException.js";

export class PreconditionRequired extends ClientException {
  static readonly STATUS = 428;

  constructor(message: string, origin?: Error | string | any) {
    super(PreconditionRequired.STATUS, message, origin);
  }
}
