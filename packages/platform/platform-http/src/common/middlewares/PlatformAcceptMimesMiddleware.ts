import {uniq} from "@tsed/core";
import {constant, injectable, ProviderType} from "@tsed/di";
import {NotAcceptable} from "@tsed/exceptions";
import {MiddlewareMethods} from "@tsed/platform-middlewares";
import {Context} from "@tsed/platform-params";

/**
 * @middleware
 * @platform
 */
export class PlatformAcceptMimesMiddleware implements MiddlewareMethods {
  acceptMimes = constant<string[]>("acceptMimes", []);

  public use(@Context() ctx: Context): void {
    const {endpoint, request} = ctx;
    const mimes = uniq((endpoint?.get("acceptMimes") || []).concat(this.acceptMimes));

    if (mimes.length && !request.accepts(mimes)) {
      throw new NotAcceptable(mimes.join(", "));
    }
  }
}

injectable(PlatformAcceptMimesMiddleware).type(ProviderType.MIDDLEWARE).priority(-10);
