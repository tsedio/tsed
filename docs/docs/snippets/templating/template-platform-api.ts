import {PlatformResponse, Res} from "@tsed/common";
import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";

@Controller("/events")
export class EventsCtrl {
  @Get("/:id")
  public async get(@Res() response: PlatformResponse): Promise<string> {
    const options = {startDate: new Date(), name: "MyEvent"};

    const result = await response.render("event.ejs", options);

    console.log(result);

    return result;
  }
}
