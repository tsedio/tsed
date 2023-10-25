import {ClientException} from "../core/ClientException";

export class UpgradeRequired extends ClientException {
  static readonly STATUS = 426;

  constructor(message: string, origin?: Error | string | any) {
    super(UpgradeRequired.STATUS, message, origin);
  }
}
