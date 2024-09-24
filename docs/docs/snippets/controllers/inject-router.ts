import {Controller} from "@tsed/di";
import {PlatformRouter} from "@tsed/platform-router";

@Controller("/calendars")
export class CalendarCtrl {
  constructor(router: PlatformRouter) {
    router.get("/", this.nativeMethod.bind(this));
  }

  nativeMethod(req: any, res: any, next: any) {}
}
