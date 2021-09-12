import {Exception} from "../core/Exception";

export class BandwidthLimitExceeded extends Exception {
  static readonly STATUS = 509;

  constructor(message: string, origin?: Error | string | any) {
    super(BandwidthLimitExceeded.STATUS, message, origin);
  }
}
