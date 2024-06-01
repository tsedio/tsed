import {RedirectException} from "../core/RedirectException.js";

export class MovedTemporarily extends RedirectException {
  static readonly STATUS = 302;
  name: string = "MOVED_TEMPORARILY";

  constructor(message: string, origin?: Error | string | any) {
    super(MovedTemporarily.STATUS, message, origin);
  }
}
