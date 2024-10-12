import {Req, Res} from "@tsed/platform-http";
import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {IncomingMessage, ServerResponse} from "http";

@Controller("/calendars")
export class CalendarCtrl {
  @Get("/:id")
  get(@Req() request: IncomingMessage, @Res() response: ServerResponse): void {
    console.log(request); // IncomingMessage
    console.log(response); // ServerResponse
  }
}
