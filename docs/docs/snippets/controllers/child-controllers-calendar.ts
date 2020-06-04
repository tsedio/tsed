import {Controller, Get} from "@tsed/common";
import {EventCtrl} from "./EventCtrl";

@Controller({
  path: "/calendars",
  children: [EventCtrl]
})
export class CalendarCtrl {
  @Get()
  get() {
  }
}
