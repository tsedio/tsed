import {Exception} from "../core/Exception";

export class BadGateway extends Exception {
  static readonly STATUS = 502;

  constructor(message: string, origin?: Error | string | any) {
    super(BadGateway.STATUS, message, origin);
  }
}
