import {Controller} from "@tsed/di";
import {CalendarCtrl} from "./CalendarCtrl";
import {EventCtrl} from "./EventCtrl";

@Controller({
  path: "/rest",
  children: [CalendarCtrl, EventCtrl]
})
export class RestCtrl {}
