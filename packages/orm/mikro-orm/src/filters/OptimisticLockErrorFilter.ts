import {OptimisticLockError} from "@mikro-orm/core";
import {Catch, type ExceptionFilterMethods} from "@tsed/platform-exceptions";
import {PlatformContext} from "@tsed/platform-http";

@Catch(OptimisticLockError)
export class OptimisticLockErrorFilter implements ExceptionFilterMethods<OptimisticLockError> {
  public catch(exception: OptimisticLockError, ctx: PlatformContext): void {
    const {response, logger} = ctx;

    logger.error({
      event: "MIKRO_ORM_OPTIMISTIC_LOCK_ERROR",
      error_name: exception.name,
      error_message: exception.message,
      stack: exception.stack
    });

    response.status(409).body(`Update refused. The resource has changed on the server. Please try again later`);
  }
}
