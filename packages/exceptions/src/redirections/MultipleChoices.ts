import {Exception} from "../core/Exception";

export class MultipleChoices extends Exception {
  static readonly STATUS = 300;
  name: string = "MULTIPLE_CHOICES";

  constructor(message: string, origin?: Error | string | any) {
    super(MultipleChoices.STATUS, message, origin);
  }
}
