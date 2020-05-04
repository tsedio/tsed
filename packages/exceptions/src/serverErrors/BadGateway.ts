import {Exception} from "../core/Exception";

export class BadGateway extends Exception {
  static readonly STATUS = 502;
  name: string = "BAD_GATEWAY";

  constructor(message: string, origin?: Error | string | any) {
    super(BadGateway.STATUS, message, origin);
  }
}
