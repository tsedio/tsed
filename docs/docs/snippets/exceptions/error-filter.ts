import {PlatformContext, ResponseErrorObject} from "@tsed/common";
import {Catch, ExceptionFilterMethods} from "@tsed/platform-exceptions";
import {Exception} from "@tsed/exceptions";

@Catch(Error, Exception)
export class ErrorFilter implements ExceptionFilterMethods {
  catch(exception: Error | Exception, ctx: PlatformContext) {
    const {response, logger} = ctx;
    const error = this.mapError(exception);
    const headers = this.getHeaders(exception);

    logger.error({
      error
    });

    response
      .setHeaders(headers)
      .status(error.status || 500)
      .body(error);
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
