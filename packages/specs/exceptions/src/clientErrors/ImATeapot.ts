import {ClientException} from "../core/ClientException.js";

export class ImATeapot extends ClientException {
  static readonly STATUS = 418;
  name: string = "IM_A_TEAPOT";

  constructor(message: string, origin?: Error | string | any) {
    super(ImATeapot.STATUS, message, origin);
  }
}
