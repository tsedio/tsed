import {Exception} from "../core/Exception";

export class UseProxy extends Exception {
  static readonly STATUS = 305;

  constructor(message: string, origin?: Error | string | any) {
    super(UseProxy.STATUS, message, origin);
  }
}
