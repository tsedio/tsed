import {RedirectException} from "../core/RedirectException.js";

export class PermanentRedirect extends RedirectException {
  static readonly STATUS = 308;

  constructor(message: string, origin?: Error | string | any) {
    super(PermanentRedirect.STATUS, message, origin);
  }
}
