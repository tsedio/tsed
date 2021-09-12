import {Env} from "@tsed/core";
import type {BaseContext} from "@tsed/di";
import {Catch} from "../decorators/catch";
import type {ExceptionFilterMethods} from "../interfaces/ExceptionFilterMethods";

@Catch(Error)
export class ErrorFilter implements ExceptionFilterMethods {
  catch(error: any, ctx: BaseContext): void {
    const {response, logger, env} = ctx;
    const err = this.mapError(error, env);

    logger.error({
      error: {...err, stack: error.stack}
    });

    response
      .onEnd(() => {
        env === "development" && ctx.injector.logger.error(error);
      })
      .setHeaders(this.getHeaders(error))
      .status(err.status)
      .contentType("application/json")
      .body(env === Env.PROD ? "InternalServerError" : err);
  }

  mapError(error: any, env?: Env) {
    return {
      name: error.origin?.name || error.name,
      message: error.message,
      status: error.status || 500,
      errors: this.getErrors(error),
      stack: env === Env.DEV ? error.stack : undefined
    };
  }

  protected getErrors(error: any) {
    return [error, error.origin].filter(Boolean).reduce((errs, {errors}: any) => {
      return errs.concat(errors).filter(Boolean);
    }, []);
  }

  protected getHeaders(error: any) {
    return [error, error.origin].filter(Boolean).reduce((obj, {headers}: any) => {
      return {
        ...obj,
        ...(headers || {})
      };
    }, {});
  }
}
