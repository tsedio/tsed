import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";

import {EventCtrl} from "./EventCtrl";

@Controller({
  path: "/calendars",
  children: [EventCtrl]
})
export class CalendarCtrl {
  @Get()
  get() {}
}
