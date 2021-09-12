import {PlatformContext, PlatformExceptions} from "@tsed/common";

/**
 * @ignore
 * @param ctx
 * @param next
 */
export async function resourceNotFoundMiddleware(ctx: any, next: any) {
  const $ctx: PlatformContext = ctx.request.$ctx;
  await next();
  const status = ctx.status || 404;

  if (status === 404 && !$ctx.isDone()) {
    $ctx.injector.get<PlatformExceptions>(PlatformExceptions)?.resourceNotFound($ctx);
  }
}
