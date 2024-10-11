import {PlatformContext} from "@tsed/platform-http";

import {Alter} from "../decorators/alter.js";
import {AlterHook} from "../domain/AlterHook.js";

@Alter("host")
export class AlterHost implements AlterHook<string> {
  transform(baseUrl: string, ctx: PlatformContext) {
    return `${ctx.request.protocol}://${ctx.request.host}${baseUrl}`;
  }
}
