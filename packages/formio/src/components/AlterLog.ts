import {PlatformContext} from "@tsed/common";
import {Alter} from "../decorators/alter";
import {AlterHook} from "../domain/AlterHook";

@Alter("log")
export class AlterLog implements AlterHook {
  transform(event: string, ctx: PlatformContext, ...info: any[]): boolean {
    ctx.logger.debug({event, info});
    return false;
  }
}
