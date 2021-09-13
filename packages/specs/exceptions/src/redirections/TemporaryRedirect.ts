import {Exception} from "../core/Exception";

export class TemporaryRedirect extends Exception {
  static readonly STATUS = 307;

  constructor(message: string, origin?: Error | string | any) {
    super(TemporaryRedirect.STATUS, message, origin);
  }
}
