import {Exception} from "../core/Exception";

export class BandwidthLimitExceeded extends Exception {
  static readonly STATUS = 509;
  name: string = "BANDWIDTH_LIMIT_EXCEEDED";

  constructor(message: string, origin?: Error | string | any) {
    super(BandwidthLimitExceeded.STATUS, message, origin);
  }
}
