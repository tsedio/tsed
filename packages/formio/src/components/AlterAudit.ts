import {PlatformContext} from "@tsed/common";
import {Alter} from "../decorators/alter";
import {AlterHook} from "../domain/AlterHook";

@Alter("audit")
export class AlterAudit implements AlterHook {
  transform(info: any[], event: string, ctx: PlatformContext): boolean {
    ctx.logger.info({event, info});
    return false;
  }
}
