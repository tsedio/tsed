import {uniq} from "@tsed/core";
import {Constant} from "@tsed/di";
import {NotAcceptable} from "@tsed/exceptions";
import {IMiddleware, Middleware} from "../../mvc";
import {Context} from "../decorators/context";

/**
 * @middleware
 * @platform
 */
@Middleware()
export class PlatformAcceptMimesMiddleware implements IMiddleware {
  @Constant("acceptMimes", [])
  acceptMimes: string[];

  public use(@Context() ctx: Context): void {
    const {endpoint, request} = ctx;
    const mimes = uniq((endpoint?.get("acceptMimes") || []).concat(this.acceptMimes));

    if (mimes.length && !request.accepts(mimes)) {
      throw new NotAcceptable(mimes.join(", "));
    }
  }
}
