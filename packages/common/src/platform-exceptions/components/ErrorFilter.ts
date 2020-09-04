import {Env} from "@tsed/core";
import type {ResponseErrorObject} from "../../mvc/interfaces/ResponseErrorObject";
import type {PlatformContext} from "../../platform/domain/PlatformContext";
import {Catch} from "../decorators/catch";
import type {ExceptionFilterMethods} from "../interfaces/ExceptionFilterMethods";

@Catch(Error)
export class ErrorFilter implements ExceptionFilterMethods {
  catch(error: unknown, ctx: PlatformContext): void {
    const {response, logger, env} = ctx;
    const err = this.mapError(error);

    logger.error({
      error: err
    });

    response
      .setHeaders(this.getHeaders(error))
      .status(err.status)
      .body(env === Env.PROD ? "InternalServerError" : err);
  }

  mapError(error: any) {
    return {
      name: error.origin?.name || error.name,
      message: error.message,
      status: error.status || 500,
      errors: this.getErrors(error)
    };
  }

  protected getErrors(error: any) {
    return [error, error.origin].filter(Boolean).reduce((errs, {errors}: ResponseErrorObject) => {
      return [...errs, ...(errors || [])];
    }, []);
  }

  protected getHeaders(error: any) {
    return [error, error.origin].filter(Boolean).reduce((obj, {headers}: ResponseErrorObject) => {
      return {
        ...obj,
        ...(headers || {})
      };
    }, {});
  }
}
