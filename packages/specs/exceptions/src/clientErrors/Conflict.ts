import {Exception} from "../core/Exception";

export class Conflict extends Exception {
  static readonly STATUS = 409;

  constructor(message: string, origin?: Error | string | any) {
    super(Conflict.STATUS, message, origin);
  }
}
