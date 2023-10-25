import {ClientException} from "../core/ClientException";

export class Gone extends ClientException {
  static readonly STATUS = 410;

  constructor(message: string, origin?: Error | string | any) {
    super(Gone.STATUS, message, origin);
  }
}
