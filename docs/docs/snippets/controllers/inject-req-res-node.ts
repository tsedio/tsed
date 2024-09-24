import {Req, Res} from "@tsed/common";
import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";
import {IncomingMessage, ServerResponse} from "http";

@Controller("/calendars")
export class CalendarCtrl {
  @Get("/:id")
  get(@Req() request: IncomingMessage, @Res() response: ServerResponse): void {
    console.log(request); // IncomingMessage
    console.log(response); // ServerResponse
  }
}
