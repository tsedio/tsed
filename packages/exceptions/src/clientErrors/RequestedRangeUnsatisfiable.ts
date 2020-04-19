import {Exception} from "../core/Exception";

export class RequestedRangeUnsatisfiable extends Exception {
  static readonly STATUS = 416;
  name: string = "REQUESTED_RANGE_UNSATISFIABLE";

  constructor(message: string, origin?: Error | string | any) {
    super(RequestedRangeUnsatisfiable.STATUS, message, origin);
  }
}
