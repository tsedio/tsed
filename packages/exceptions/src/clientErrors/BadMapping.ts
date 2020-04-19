import {Exception} from "../core/Exception";

export class BadMapping extends Exception {
  static readonly STATUS = 421;
  name: string = "BAD_MAPPING";

  constructor(message: string, origin?: Error | string | any) {
    super(BadMapping.STATUS, message, origin);
  }
}
