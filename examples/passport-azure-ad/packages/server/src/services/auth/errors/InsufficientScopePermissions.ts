import {Forbidden} from "@tsed/exceptions";


export class InsufficientScopePermissions extends Forbidden {
  constructor(requiredScope: string, tokenScope: string) {
    super(`Insufficient Scope Permissions: Scope "${String(requiredScope)}" is required. Token scopes: ${tokenScope}`);
  }
}
