import {OptimisticLockError} from "@mikro-orm/core";
import {Catch, ExceptionFilterMethods, PlatformContext} from "@tsed/common";

@Catch(OptimisticLockError)
export class OptimisticLockErrorFilter implements ExceptionFilterMethods<OptimisticLockError> {
  public catch(exception: OptimisticLockError, ctx: PlatformContext): void {
    const {response, logger} = ctx;

    logger.error({
      exception
    });

    response.status(409).body(`Update refused. The resource has changed on the server. Please try again later`);
  }
}
