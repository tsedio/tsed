import {PlatformRouter} from "@tsed/common";
import {Controller} from "@tsed/di";

@Controller("/calendars")
export class CalendarCtrl {
  constructor(router: PlatformRouter) {
    router.get("/", this.myMethod);
  }

  myMethod(req: any, res: any, next: any) {}
}
