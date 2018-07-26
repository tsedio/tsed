import * as Express from "express";
import {Exception} from "ts-httpexceptions";
import {ServerSettingsService} from "../../config";
import {Err} from "../../filters/decorators/error";
import {Request} from "../../filters/decorators/request";
import {Response} from "../../filters/decorators/response";
import {MiddlewareError} from "../decorators/class/middlewareError";
import {IMiddlewareError} from "../interfaces";
import {IResponseError} from "../interfaces/IResponseError";

/**
 * @middleware
 */
@MiddlewareError()
export class GlobalErrorHandlerMiddleware implements IMiddlewareError {
  private headerName: string;

  constructor(settingsServerService: ServerSettingsService) {
    const {headerName = "errors"} = settingsServerService.errors;
    this.headerName = headerName;
  }

  use(@Err() error: any, @Request() request: Express.Request, @Response() response: Express.Response): any {
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

  /**
   *
   * @param {e.Response} response
   * @param args
   */
  setHeaders(response: Express.Response, ...args: IResponseError[]) {
    let hErrors: any = [];

    args.filter(o => !!o).forEach(({headers, errors}: IResponseError) => {
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
