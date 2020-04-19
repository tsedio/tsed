import {Exception} from "../core/Exception";

export class MisdirectedRequest extends Exception {
  static readonly STATUS = 421;
  name: string = "MISDIRECTED_REQUEST";

  constructor(message: string, origin?: Error | string | any) {
    super(MisdirectedRequest.STATUS, message, origin);
  }
}
