import {Controller, Get, Req, Res, PlatformRequest, PlatformResponse} from "@tsed/common";

@Controller("/calendars")
export class CalendarCtrl {
  @Get("/:id")
  get(
    @Req() request: PlatformRequest,
    @Res() response: PlatformResponse
  ): void {
    console.log(request) // PlatformRequest
    console.log(response) // PlatformResponse

    response
      .status(200)
      .body({id: request.params.id, name: "test"});
  }
}
