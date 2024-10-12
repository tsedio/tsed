import {PlatformContext} from "@tsed/platform-http";

import {Alter} from "../decorators/alter.js";
import {AlterHook} from "../domain/AlterHook.js";

@Alter("log")
export class AlterLog implements AlterHook {
  transform(event: string, ctx: PlatformContext, ...info: any[]): boolean {
    ctx.logger.debug({event, info});
    return false;
  }
}
