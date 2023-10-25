import {ServerException} from "../core/ServerException";

export class BandwidthLimitExceeded extends ServerException {
  static readonly STATUS = 509;

  constructor(message: string, origin?: Error | string | any) {
    super(BandwidthLimitExceeded.STATUS, message, origin);
  }
}
