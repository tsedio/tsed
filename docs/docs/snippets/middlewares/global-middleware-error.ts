import {Err, Middleware, Req, Res} from "@tsed/common";
import {Exception} from "ts-httpexceptions";
import {$log} from "ts-log-debug";

@Middleware()
export class GlobalErrorHandlerMiddleware {
  use(
    @Err() error: any,
    @Req() request: Req,
    @Res() response: Res
  ): any {

    if (response.headersSent) {
      throw error;
    }

    const toHTML = (message = "") => message.replace(/\n/gi, "<br />");

    if (error instanceof Exception) {
      $log.error("" + error);
      response.status(error.status).send(toHTML(error.message));

      return;
    }

    if (typeof error === "string") {
      response.status(404).send(toHTML(error));

      return;
    }

    $log.error("" + error);
    response.status(error.status || 500).send("Internal Error");

    return;
  }
}
