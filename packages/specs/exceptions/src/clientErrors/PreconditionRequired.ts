import {ClientException} from "../core/ClientException";

export class PreconditionRequired extends ClientException {
  static readonly STATUS = 428;

  constructor(message: string, origin?: Error | string | any) {
    super(PreconditionRequired.STATUS, message, origin);
  }
}
