import {Exception} from "../core/Exception";

export class UnprocessableEntity extends Exception {
  static readonly STATUS = 422;

  constructor(message: string, origin?: Error | string | any) {
    super(UnprocessableEntity.STATUS, message, origin);
  }
}
