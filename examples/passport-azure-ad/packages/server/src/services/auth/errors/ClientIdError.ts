import {Unauthorized} from "ts-httpexceptions";

export class ClientIdError extends Unauthorized {
  constructor() {
    super("CliendId mismatch")
  }
}
