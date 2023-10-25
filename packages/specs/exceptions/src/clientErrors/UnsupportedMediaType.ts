import {ClientException} from "../core/ClientException";

export class UnsupportedMediaType extends ClientException {
  static readonly STATUS = 415;

  constructor(message: string, origin?: Error | string | any) {
    super(UnsupportedMediaType.STATUS, message, origin);
  }
}
