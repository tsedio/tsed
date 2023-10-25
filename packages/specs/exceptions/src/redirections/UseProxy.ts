import {RedirectException} from "../core/RedirectException";

export class UseProxy extends RedirectException {
  static readonly STATUS = 305;

  constructor(message: string, origin?: Error | string | any) {
    super(UseProxy.STATUS, message, origin);
  }
}
