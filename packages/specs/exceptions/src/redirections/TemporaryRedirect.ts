import {RedirectException} from "../core/RedirectException";

export class TemporaryRedirect extends RedirectException {
  static readonly STATUS = 307;

  constructor(message: string, origin?: Error | string | any) {
    super(TemporaryRedirect.STATUS, message, origin);
  }
}
