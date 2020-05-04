import {Exception} from "../core/Exception";

export class TemporaryRedirect extends Exception {
  static readonly STATUS = 307;
  name: string = "TEMPORARY_REDIRECT";

  constructor(message: string, origin?: Error | string | any) {
    super(TemporaryRedirect.STATUS, message, origin);
  }
}
