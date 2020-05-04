import {Exception} from "../core/Exception";

export class UnprocessableEntity extends Exception {
  static readonly STATUS = 422;
  name: string = "UNPROCESSABLE_ENTITY";

  constructor(message: string, origin?: Error | string | any) {
    super(UnprocessableEntity.STATUS, message, origin);
  }
}
