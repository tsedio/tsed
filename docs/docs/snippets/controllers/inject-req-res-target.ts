import {Req, Res} from "@tsed/platform-http";
import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";

@Controller("/calendars")
export class CalendarCtrl {
  @Get("/:id")
  get(@Req() request: any, @Res() response: any): void {
    console.log(request); // Express.Request or Koa.Request
    console.log(response); // Express.Response or Koa.Response
    response.status(200).send({id: request.params.id, name: "test"});
  }
}
