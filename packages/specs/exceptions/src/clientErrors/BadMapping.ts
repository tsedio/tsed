import {ClientException} from "../core/ClientException";

export class BadMapping extends ClientException {
  static readonly STATUS = 421;
  name: string = "BAD_MAPPING";

  constructor(message: string, origin?: Error | string | any) {
    super(BadMapping.STATUS, message, origin);
  }
}
