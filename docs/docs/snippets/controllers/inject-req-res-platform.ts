import {PlatformRequest, PlatformResponse, Req, Res} from "@tsed/platform-http";
import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";

@Controller("/calendars")
export class CalendarCtrl {
  @Get("/:id")
  get(@Req() request: PlatformRequest, @Res() response: PlatformResponse): void {
    console.log(request); // PlatformRequest
    console.log(response); // PlatformResponse

    response.status(200).body({id: request.params.id, name: "test"});
  }
}
