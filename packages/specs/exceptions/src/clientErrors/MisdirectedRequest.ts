import {ClientException} from "../core/ClientException";

export class MisdirectedRequest extends ClientException {
  static readonly STATUS = 421;

  constructor(message: string, origin?: Error | string | any) {
    super(MisdirectedRequest.STATUS, message, origin);
  }
}
