import {RedirectException} from "../core/RedirectException.js";

export class MovedPermanently extends RedirectException {
  static readonly STATUS = 301;

  constructor(message: string, origin?: Error | string | any) {
    super(MovedPermanently.STATUS, message, origin);
  }
}
