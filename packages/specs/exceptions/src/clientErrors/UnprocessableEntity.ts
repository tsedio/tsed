import {ClientException} from "../core/ClientException.js";

export class UnprocessableEntity extends ClientException {
  static readonly STATUS = 422;

  constructor(message: string, origin?: Error | string | any) {
    super(UnprocessableEntity.STATUS, message, origin);
  }
}
