import {Controller, Get, Next, Req, Res} from "@tsed/common";
import * as Express from "express";

@Controller("/calendars")
export class CalendarCtrl {
  @Get("/:id")
  get(
    @Req() request: Express.Request,
    @Res() response: Express.Response,
    @Next() next: Express.NextFunction
  ): void {
    setTimeout(() => {
      response
        .status(200)
        .send({id: request.params.id, name: "test"});
      next();
    });
  }
}
