import {Exception} from "../core/Exception";

export class ServiceUnvailable extends Exception {
  static readonly STATUS = 503;

  constructor(message: string, origin?: Error | string | any) {
    super(ServiceUnvailable.STATUS, message, origin);
  }
}
