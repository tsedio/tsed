import {Exception} from "../core/Exception";

export class NotImplemented extends Exception {
  static readonly STATUS = 501;

  constructor(message: string, origin?: Error | string | any) {
    super(NotImplemented.STATUS, message, origin);
  }
}
