import {Exception} from "../core/Exception";

export class NotAcceptable extends Exception {
  static readonly STATUS = 406;

  constructor(message: string, origin: Error | string | any = "You must accept content-type " + message) {
    super(NotAcceptable.STATUS, origin);
  }
}
