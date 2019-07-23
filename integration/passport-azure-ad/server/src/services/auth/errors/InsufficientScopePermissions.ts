import {Forbidden} from "ts-httpexceptions";


export class InsufficientScopePermissions extends Forbidden {
  constructor(requiredScope: string, tokenScope: string) {
    super(`Insufficient Scope Permissions: Scope "${String(requiredScope)}" is required. Token scopes: ${tokenScope}`);
  }
}
