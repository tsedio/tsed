import {Controller, Get, Req, Res} from "@tsed/common";

@Controller("/calendars")
export class CalendarCtrl {
  @Get("/:id")
  get(
    @Req() request: any,
    @Res() response: any
  ): void {
    console.log(request) // Express.Request or Koa.Request
    console.log(response) // Express.Request or Koa.Request
    response
      .status(200)
      .send({id: request.params.id, name: "test"});
  }
}
