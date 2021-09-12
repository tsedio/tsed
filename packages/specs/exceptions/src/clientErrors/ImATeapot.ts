import {Exception} from "../core/Exception";

export class ImATeapot extends Exception {
  static readonly STATUS = 418;
  name: string = "IM_A_TEAPOT";

  constructor(message: string, origin?: Error | string | any) {
    super(ImATeapot.STATUS, message, origin);
  }
}
