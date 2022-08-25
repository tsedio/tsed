import {PlatformRouter} from "@tsed/platform-router";
import {Controller} from "@tsed/di";

@Controller("/calendars")
export class CalendarCtrl {
  constructor(router: PlatformRouter) {
    router.get("/", this.nativeMethod.bind(this));
  }

  nativeMethod(req: any, res: any, next: any) {}
}
