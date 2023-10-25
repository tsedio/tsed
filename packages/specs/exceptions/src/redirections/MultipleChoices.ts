import {RedirectException} from "../core/RedirectException";

export class MultipleChoices extends RedirectException {
  static readonly STATUS = 300;

  constructor(message: string, origin?: Error | string | any) {
    super(MultipleChoices.STATUS, message, origin);
  }
}
