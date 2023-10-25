import {Exception} from "./Exception";
import {StatusFamily} from "./StatusFamily";

export class ServerException extends Exception {
  constructor(status: number, message: string, origin?: Error | string | any) {
    super(Exception.validate(status, StatusFamily["5xx"]), message, origin);
  }
}
