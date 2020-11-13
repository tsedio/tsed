import {Exception} from "../core/Exception";

export class RequestRangeUnsatisfiable extends Exception {
  static readonly STATUS = 416;

  constructor(message: string, origin?: Error | string | any) {
    super(RequestRangeUnsatisfiable.STATUS, message, origin);
  }
}
