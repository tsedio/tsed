import {ClientException} from "../core/ClientException";

export class NotAcceptable extends ClientException {
  static readonly STATUS = 406;

  constructor(message: string, origin: Error | string | any = "You must accept content-type " + message) {
    super(NotAcceptable.STATUS, origin);
  }
}
