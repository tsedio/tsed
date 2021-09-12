import {Exception} from "../core/Exception";

export class MultipleChoices extends Exception {
  static readonly STATUS = 300;

  constructor(message: string, origin?: Error | string | any) {
    super(MultipleChoices.STATUS, message, origin);
  }
}
