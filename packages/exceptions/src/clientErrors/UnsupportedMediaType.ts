import {Exception} from "../core/Exception";

export class UnsupportedMediaType extends Exception {
  static readonly STATUS = 415;

  constructor(message: string, origin?: Error | string | any) {
    super(UnsupportedMediaType.STATUS, message, origin);
  }
}
