import {DIContext} from "@tsed/di";
import {Alter} from "../decorators/alter";
import {AlterHook} from "../domain/AlterHook";

@Alter("audit")
export class AlterAudit implements AlterHook {
  transform(info: any[], event: string, ctx: DIContext): boolean {
    ctx.logger.info({event, info});
    return false;
  }
}
