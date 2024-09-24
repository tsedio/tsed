import {Req, Res} from "@tsed/common";
import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";

@Controller("/calendars")
export class CalendarCtrl {
  @Get("/:id")
  get(@Req() request: any, @Res() response: any): void {
    console.log(request); // Express.Request or Koa.Request
    console.log(response); // Express.Response or Koa.Response
    response.status(200).send({id: request.params.id, name: "test"});
  }
}
