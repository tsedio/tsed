import {ClientException} from "../core/ClientException";

export class RequestRangeUnsatisfiable extends ClientException {
  static readonly STATUS = 416;

  constructor(message: string, origin?: Error | string | any) {
    super(RequestRangeUnsatisfiable.STATUS, message, origin);
  }
}
