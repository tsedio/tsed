import {Unauthorized} from "@tsed/exceptions";

export class ClientIdError extends Unauthorized {
  constructor() {
    super("CliendId mismatch");
  }
}
