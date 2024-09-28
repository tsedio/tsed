import {Unauthorized} from "@tsed/exceptions";

export class PassportMessage extends Unauthorized {
  constructor(
    message: string,
    public opts: Record<string, unknown> = {}
  ) {
    super(message);
  }
}
