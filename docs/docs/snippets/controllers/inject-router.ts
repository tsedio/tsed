import {Controller, PlatformRouter} from "@tsed/common";

@Controller("/calendars")
export class CalendarCtrl {
  constructor(router: PlatformRouter) {
    router.get("/", this.myMethod);
  }

  myMethod(req: any, res: any, next: any) {
  }
}
