import {Unauthorized} from "ts-httpexceptions";

export class TenantIdError extends Unauthorized {
  constructor() {
    super("TenantId mismatch")
  }
}
