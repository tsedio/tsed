import {PlatformContext} from "@tsed/common";
import {getContext} from "@tsed/di";
import {PlatformExceptions} from "@tsed/platform-exceptions";

/**
 * @ignore
 * @param ctx
 * @param next
 */
export async function resourceNotFoundMiddleware(ctx: any, next: any) {
  const $ctx = getContext<PlatformContext>()!;
  await next();
  const status = ctx.status || 404;

  if (status === 404 && !$ctx.isDone()) {
    $ctx.injector.get<PlatformExceptions>(PlatformExceptions)?.resourceNotFound($ctx);
  }
}
