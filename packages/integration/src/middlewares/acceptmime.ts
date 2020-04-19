import * as Express from "express";
import {NotAcceptable} from "@tsed/exceptions";
import {IMiddleware, Middleware, Next, Request} from "@tsed/common";

@Middleware()
export default class TestAcceptMimeMiddleware implements IMiddleware {
  private mimes = ["application/json"];

  public use(@Request() request: Express.Request, @Next() next: Function) {
    this.mimes.forEach(mime => {
      if (!request.accepts(mime)) {
        throw new NotAcceptable(mime);
      }
    });

    next();
  }
}
