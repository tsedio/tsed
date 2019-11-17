import {Middleware, Res} from "@tsed/common";
import * as Express from "express";

@Middleware()
export class NotFoundMiddleware {
  use(@Res() response: Express.Response) {
    response.status(404).render("404.html");
  }
}
