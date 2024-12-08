import {Controller} from "@tsed/di";
import {Docs} from "@tsed/swagger";

@Controller("/calendars")
@Docs("api-v2") // display this controllers only for api-docs-v2
export class CalendarCtrlV2 {}

// OR
@Controller("/calendars")
@Docs("api-v2", "api-v1") // display this controllers for api-docs-v2 and api-docs-v1
export class CalendarCtrl {}
