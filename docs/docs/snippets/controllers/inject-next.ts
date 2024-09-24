import {Next, Req, Res} from "@tsed/common";
import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";
import * as Express from "express";
import {promisify} from "util";

@Controller("/calendars")
export class CalendarCtrl {
  @Get("/:id")
  async get(@Req() request: Express.Request, @Res() response: Express.Response, @Next() next: Express.NextFunction) {
    setTimeout(() => {
      myExpressMiddleware(request, response, next);
    });

    // But it's also possible to do this
    await promisify(myExpressMiddleware)(request, response);
  }
}
