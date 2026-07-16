import {Alter} from "../decorators/alter.js";
import {AlterHook} from "../domain/AlterHook.js";
import {PlatformContext} from "@tsed/platform-http";

@Alter("log")
export class AlterLog implements AlterHook {
  transform(event: string, ctx: PlatformContext, ...info: any[]): boolean {
    ctx.logger.debug({event, info});
    return false;
  }
}
