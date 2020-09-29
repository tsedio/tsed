import {Unauthorized} from "@tsed/exceptions";

export class TenantIdError extends Unauthorized {
  constructor() {
    super("TenantId mismatch");
  }
}
