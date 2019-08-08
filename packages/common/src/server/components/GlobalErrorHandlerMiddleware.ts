import {Constant} from "@tsed/di";
import * as Express from "express";
import {Exception} from "ts-httpexceptions";
import {Err, IMiddlewareError, IResponseError, Middleware, Req, Res} from "../../mvc";

/**
 * @middleware
 */
@Middleware()
export class GlobalErrorHandlerMiddleware implements IMiddlewareError {
  @Constant("errors.headerName", "errors")
  protected headerName: string;

  use(@Err() error: any, @Req() request: Req, @Res() response: Res): any {
    const toHTML = (message = "") => message.replace(/\n/gi, "<br />");

    if (error instanceof Exception || error.status) {
      request.log.error({
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
      response.status(404).send(toHTML(error));

      return;
    }

    request.log.error({
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

  setHeaders(response: Express.Response, ...args: IResponseError[]) {
    let hErrors: any = [];

    args
      .filter(o => !!o)
      .forEach(({headers, errors}: IResponseError) => {
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
