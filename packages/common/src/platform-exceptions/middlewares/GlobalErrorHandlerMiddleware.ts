import {Constant} from "@tsed/di";
import {Exception} from "@tsed/exceptions";
import {Err, IMiddleware, ResponseErrorObject, Middleware, Req, Res} from "../../mvc";
import "../components/StringErrorFilter";
import {getExceptionTypes} from "../domain/ExceptionTypesContainer";

/**
 * Catch all errors and return the json error with the right status code when it's possible.
 *
 * ::: warning
 * Use @@Catch@@ decorator to handler a specific exception.
 * :::
 *
 * @middleware
 * @deprecated Use Catch decorator to handler a specific exception.
 */
@Middleware()
export class GlobalErrorHandlerMiddleware implements IMiddleware {
  types = getExceptionTypes();
  @Constant("errors.headerName", "errors")
  protected headerName: string;

  use(@Err() error: any, @Req() request: Req, @Res() response: Res): any {
    const logger = request.ctx.logger;

    const toHTML = (message = "") => message.replace(/\n/gi, "<br />");

    if (error instanceof Exception || error.status) {
      logger.error({
        error: {
          message: error.message,
          stack: error.stack,
          status: error.status,
          origin: error.origin
        }
      });

      this.setHeaders(response, error, error.origin);

      response.status(error.status).send(toHTML(error.message));

      return;
    }

    if (typeof error === "string") {
      this.types.get(String)!.catch(error, request.ctx);

      return;
    }

    logger.error({
      error: {
        status: 500,
        message: error.message,
        stack: error.stack,
        origin: error.origin
      }
    });

    this.setHeaders(response, error, error.origin);

    response.status(error.status || 500).send("Internal Error");

    return;
  }

  setHeaders(response: Res, ...args: ResponseErrorObject[]) {
    let hErrors: any = [];

    args
      .filter((o) => !!o)
      .forEach(({headers, errors}: ResponseErrorObject) => {
        if (headers) {
          response.set(headers);
        }

        if (errors) {
          hErrors = hErrors.concat(errors);
        }
      });

    if (hErrors.length) {
      response.set(this.headerName, JSON.stringify(hErrors));
    }
  }
}
