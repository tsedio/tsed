import {Exception} from "./Exception.js";
import {StatusFamily} from "./StatusFamily.js";

export class RedirectException extends Exception {
  constructor(status: number, message: string, origin?: Error | string | any) {
    super(Exception.validate(status, StatusFamily["3xx"]), message, origin);
  }
}
