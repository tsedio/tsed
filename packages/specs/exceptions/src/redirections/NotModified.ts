import {RedirectException} from "../core/RedirectException.js";

export class NotModified extends RedirectException {
  static readonly STATUS = 304;

  constructor(message: string, origin?: Error | string | any) {
    super(NotModified.STATUS, message, origin);
  }
}
