import {Exception} from "../core/Exception";

export class TooManyRedirects extends Exception {
  static readonly STATUS = 310;

  constructor(message: string, origin?: Error | string | any) {
    super(TooManyRedirects.STATUS, message, origin);
  }
}
