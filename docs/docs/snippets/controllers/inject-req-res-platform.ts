import {PlatformRequest, PlatformResponse, Req, Res} from "@tsed/common";
import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";

@Controller("/calendars")
export class CalendarCtrl {
  @Get("/:id")
  get(@Req() request: PlatformRequest, @Res() response: PlatformResponse): void {
    console.log(request); // PlatformRequest
    console.log(response); // PlatformResponse

    response.status(200).body({id: request.params.id, name: "test"});
  }
}
