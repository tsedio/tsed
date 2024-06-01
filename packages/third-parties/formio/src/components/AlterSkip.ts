import {Constant, PlatformContext} from "@tsed/common";
import {normalizePath} from "@tsed/normalize-path";
import {Alter} from "../decorators/alter.js";
import {AlterHook} from "../domain/AlterHook.js";

@Alter("skip")
export class AlterSkip implements AlterHook {
  @Constant("formio.baseUrl", "/")
  baseUrl: string;

  @Constant("formio.whiteList", ["/spec.json"])
  whiteList: string[];

  transform(value: any, ctx: PlatformContext): any {
    if (value) {
      return true;
    }

    const {request} = ctx;
    const url = request.url.split("?")[0];

    return !!this.whiteList.find((entry) => {
      return normalizePath(this.baseUrl, entry) === url;
    });
  }
}
