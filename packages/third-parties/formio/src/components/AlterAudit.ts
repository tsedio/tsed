import {DIContext} from "@tsed/di";

import {Alter} from "../decorators/alter.js";
import {AlterHook} from "../domain/AlterHook.js";

@Alter("audit")
export class AlterAudit implements AlterHook {
  transform(info: any[], event: string, ctx: DIContext): boolean {
    ctx.logger.info({event, info});
    return false;
  }
}
