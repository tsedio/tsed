import {Exception} from "@tsed/exceptions";

export class PassportException extends Exception {
  constructor(error: any) {
    super(error.status || 500, error.message);
    this.name = error.name || this.name;
  }
}
