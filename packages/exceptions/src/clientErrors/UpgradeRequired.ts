import {Exception} from "../core/Exception";

export class UpgradeRequired extends Exception {
  static readonly STATUS = 426;
  name: string = "UPGRADE_REQUIRED";

  constructor(message: string, origin?: Error | string | any) {
    super(UpgradeRequired.STATUS, message, origin);
  }
}
