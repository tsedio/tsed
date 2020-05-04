import {Exception} from "../core/Exception";

export class PermanentRedirect extends Exception {
  static readonly STATUS = 308;
  name: string = "PERMANENT_REDIRECT";

  constructor(message: string, origin?: Error | string | any) {
    super(PermanentRedirect.STATUS, message, origin);
  }
}
