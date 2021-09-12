import {PlatformContext} from "@tsed/common";
import {Alter} from "../decorators/alter";
import {AlterHook} from "../domain/AlterHook";

@Alter("host")
export class AlterHost implements AlterHook<string> {
  transform(baseUrl: string, ctx: PlatformContext) {
    return `${ctx.request.protocol}://${ctx.request.host}${baseUrl}`;
  }
}
